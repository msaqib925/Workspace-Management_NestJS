import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AssignBrandMemberDto } from './dto/assign-brand-member.dto';
import { BrandRole } from '@prisma/client';

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) { }

    async createBrand(workspaceId: string, dto: CreateBrandDto, currentUserId: string) {

        const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!workspace) throw new NotFoundException('Workspace not found');
        if (workspace.ownerId !== currentUserId) throw new ForbiddenException('Not authorized');

        return this.prisma.brand.create({
            data: {
                name: dto.name,
                workspaceId,
            },
        });
    }

    async listBrands(workspaceId: string, currentUserId: string) {

        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: currentUserId },
        });
        if (!member) throw new ForbiddenException('Not authorized');

        return this.prisma.brand.findMany({ where: { workspaceId }, include: { members: true } });
    }

    async assignMember(brandId: string, dto: AssignBrandMemberDto, currentUserId: string) {

        const brand = await this.prisma.brand.findUnique({
            where: { id: brandId },
            include: { workspace: true },
        });
        if (!brand) throw new NotFoundException('Brand not found');

        const workspace = brand.workspace;
        if (workspace.ownerId !== currentUserId)
            throw new ForbiddenException('Not authorized to assign members');


        return this.prisma.brandMember.upsert({
            where: { brandId_userId: { brandId, userId: dto.userId } },
            update: { role: dto.role },
            create: { brandId, userId: dto.userId, role: dto.role },
        });
    }

    async updateMemberRole(brandId: string, userId: string, role: string, currentUserId: string) {
        const brand = await this.prisma.brand.findUnique({ where: { id: brandId }, include: { workspace: true } });
        if (!brand) throw new NotFoundException('Brand not found');

        if (brand.workspace.ownerId !== currentUserId)
            throw new ForbiddenException('Not authorized');

        return this.prisma.brandMember.update({
            where: { brandId_userId: { brandId, userId } },
            data: { role: role as BrandRole },
        });
    }
}
