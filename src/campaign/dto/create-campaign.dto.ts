import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
    @ApiProperty({ example: 'New Product Launch', description: 'Campaign name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'DRAFT', enum: CampaignStatus, description: 'Campaign status' })
    @IsEnum(CampaignStatus)
    status: CampaignStatus;
}
