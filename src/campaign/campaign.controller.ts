import { Controller, Post, Body, Param, Get, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@ApiTags('Campaigns')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('brands/:brandId/campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    @ApiOperation({ summary: 'Create a campaign in a brand' })
    @ApiResponse({ status: 201, description: 'Campaign created successfully' })
    create(@Param('brandId') brandId: string, @Body() dto: CreateCampaignDto, @Req() req) {
        return this.campaignService.createCampaign(brandId, dto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'List all campaigns in a brand' })
    list(@Param('brandId') brandId: string, @Req() req) {
        return this.campaignService.listCampaigns(brandId, req.user.userId);
    }

    @Put(':campaignId')
    @ApiOperation({ summary: 'Update a campaign' })
    update(@Param('campaignId') campaignId: string, @Body() dto: UpdateCampaignDto, @Req() req) {
        return this.campaignService.updateCampaign(campaignId, dto, req.user.userId);
    }

    @Delete(':campaignId')
    @ApiOperation({ summary: 'Delete a campaign' })
    remove(@Param('campaignId') campaignId: string, @Req() req) {
        return this.campaignService.deleteCampaign(campaignId, req.user.userId);
    }
}
