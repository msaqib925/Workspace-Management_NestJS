import { Controller, Post, Body, Param, Get, Put, UseGuards, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AssignBrandMemberDto } from './dto/assign-brand-member.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@ApiTags('Brands')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('workspaces/:workspaceId/brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new brand in a workspace' })
    @ApiResponse({ status: 201, description: 'Brand created successfully' })
    create(@Param('workspaceId') workspaceId: string, @Body() dto: CreateBrandDto, @Req() req) {
        return this.brandService.createBrand(workspaceId, dto, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'List all brands in a workspace' })
    list(@Param('workspaceId') workspaceId: string, @Req() req) {
        return this.brandService.listBrands(workspaceId, req.user.userId);
    }

    @Post(':brandId/members')
    @ApiOperation({ summary: 'Assign a user to a brand' })
    assignMember(
        @Param('brandId') brandId: string,
        @Body() dto: AssignBrandMemberDto,
        @Req() req,
    ) {
        return this.brandService.assignMember(brandId, dto, req.user.userId);
    }

    @Put(':brandId/members/:userId')
    @ApiOperation({ summary: 'Update role of a brand member' })
    updateMemberRole(
        @Param('brandId') brandId: string,
        @Param('userId') userId: string,
        @Body('role') role: string,
        @Req() req,
    ) {
        return this.brandService.updateMemberRole(brandId, userId, role, req.user.userId);
    }
}
