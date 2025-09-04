import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    // ------------------ GET PROFILE ------------------

    async myProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }, // Numeric ID Conversion
            select: { id: true, email: true, name: true, isVerified: true },
        });

        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        return user;
    }

    // ------------------ UPDATE PROFILE ------------------

    async updateProfile(userId: string, dto: updateProfileDto) {
        if (dto.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
            if (existing && existing.id !== userId) throw new BadRequestException('Email already in use');
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: { id: true, email: true, name: true, isVerified: true, updatedAt: true }
        });

        return { message: 'Profile updated successfully.', updated };
    }
}
