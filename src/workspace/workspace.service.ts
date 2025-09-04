import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class WorkspaceService {
    constructor(private prisma: PrismaService) { }

    // ------------------ CREATE WORKSPACE ------------------

    async create(userId: string, dto: CreateWorkspaceDto) {
        return this.prisma.workspace.create({
            data: {
                name: dto.name,
                ownerId: userId,
                members: {
                    create: {
                        userId: userId,
                        role: 'ADMIN'
                    }
                }

            }
        })
    }

    // ------------------ ALL WORKSPACES ------------------

    async findAll(userId: string) {
        return this.prisma.workspace.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: { members: true },
        });
    }

    // ------------------ GET SINGLE WORKSPACE ------------------

    async findOne(id: string, userId: string) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                id,
                members: {
                    some: { userId },
                },
            },
            include: { members: true },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }
        return workspace;
    }

    // ------------------ UPDATE WORKSPACE ------------------

    async update(id: string, dto: UpdateWorkspaceDto, userId: string) {

        const workspace = await this.prisma.workspace.findUnique({ where: { id } });
        if (!workspace || workspace.ownerId !== userId) {
            throw new NotFoundException('Workspace not found or not authorized');
        }

        return this.prisma.workspace.update({
            where: { id },
            data: { ...dto },
        });
    }

    // ------------------ DELETE WORKSPACE ------------------

    async remove(id: string, userId: string) {
        const workspace = await this.prisma.workspace.findUnique({ where: { id } });
        if (!workspace || workspace.ownerId !== userId) {
            throw new NotFoundException('Workspace not found or not authorized');
        }

        return this.prisma.workspace.delete({ where: { id } });
    }

    // ------------------ INVITE MEMBER TO WORKSPACE ------------------

    async inviteMember(workspaceId: string, dto: InviteMemberDto, currentUserId: string) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
        });
        if (!workspace) throw new NotFoundException('Workspace not found');

        if (workspace.ownerId !== currentUserId)
            throw new ForbiddenException('Only owner can invite members');

        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            // TODO: create pending invite, or send signup link
        } else {
            // Add user to workspace members
            await this.prisma.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId,
                    role: 'USER',
                },
            });

            // TODO: Send invitation email (SendGrid / SES)
        }

        return { message: `Invitation sent to ${dto.email}` };
    }

    // ------------------ REMOVE MEMBER FROM WORKSPACE ------------------

    async removeMember(workspaceId: string, userId: string, currentUserId: string) {
        const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!workspace) throw new NotFoundException('Workspace not found');

        if (workspace.ownerId !== currentUserId)
            throw new ForbiddenException('Only owner can remove members');

        await this.prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
        });

        return { message: `User ${userId} removed from workspace ${workspaceId}` };
    }

}
