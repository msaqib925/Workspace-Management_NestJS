import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
    constructor(private prisma: PrismaService) { }

    async createCampaign(brandId: string, dto: CreateCampaignDto, currentUserId: string) {
        const brand = await this.prisma.brand.findUnique({ where: { id: brandId }, include: { members: true } });
        if (!brand) throw new NotFoundException('Brand not found');

        // Check role
        const member = brand.members.find(m => m.userId === currentUserId);
        if (!member || (member.role !== 'ADMIN' && member.role !== 'MANAGER'))
            throw new ForbiddenException('Not authorized to create campaign');

        return this.prisma.campaign.create({
            data: {
                name: dto.name,
                status: dto.status,
                brandId,
            },
        });
    }

    async listCampaigns(brandId: string, currentUserId: string) {
        const brand = await this.prisma.brand.findUnique({ where: { id: brandId }, include: { members: true, campaigns: true } });
        if (!brand) throw new NotFoundException('Brand not found');

        const member = brand.members.find(m => m.userId === currentUserId);
        if (!member) throw new ForbiddenException('Not authorized to view campaigns');

        return brand.campaigns;
    }

    async updateCampaign(campaignId: string, dto: UpdateCampaignDto, currentUserId: string) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId }, include: { brand: { include: { members: true } } } });
        if (!campaign) throw new NotFoundException('Campaign not found');

        const member = campaign.brand.members.find(m => m.userId === currentUserId);
        if (!member || (member.role !== 'ADMIN' && member.role !== 'MANAGER'))
            throw new ForbiddenException('Not authorized to update campaign');

        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: dto,
        });
    }

    async deleteCampaign(campaignId: string, currentUserId: string) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId }, include: { brand: { include: { members: true } } } });
        if (!campaign) throw new NotFoundException('Campaign not found');

        const member = campaign.brand.members.find(m => m.userId === currentUserId);
        if (!member || (member.role !== 'ADMIN' && member.role !== 'MANAGER'))
            throw new ForbiddenException('Not authorized to delete campaign');

        return this.prisma.campaign.delete({ where: { id: campaignId } });
    }
}
