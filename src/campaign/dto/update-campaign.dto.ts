import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';

export class UpdateCampaignDto {
    @ApiPropertyOptional({ example: 'Updated Campaign Name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'ACTIVE', enum: CampaignStatus })
    @IsEnum(CampaignStatus)
    @IsOptional()
    status?: CampaignStatus;
}
