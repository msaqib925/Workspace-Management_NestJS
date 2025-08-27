import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getAllUsers(): Promise<any[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isVerified: true
            }
        })
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }, select: {
                id: true,
                email: true,
                name: true,
                isVerified: true
            }
        });

        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user
    }

    async deleteUser(id: number) {
        const user = await this.getUserById(id)

        await this.prisma.user.delete({ where: { id } })

        return { message: `User ${user.name} has been deleted` }
    }
}

