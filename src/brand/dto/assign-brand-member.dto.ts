import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BrandRole } from '@prisma/client';

export class AssignBrandMemberDto {
    @ApiProperty({ example: 'user-id-here', description: 'User ID to assign' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'MANAGER', enum: BrandRole })
    @IsEnum(BrandRole)
    role: BrandRole;
}
