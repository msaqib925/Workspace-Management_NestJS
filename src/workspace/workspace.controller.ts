import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Req,
    Put,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('Workspaces')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) { }

    // ------------------ CREATE WORKSPACE ------------------

    @Post()
    @ApiOperation({ summary: 'Create a new workspace' })
    @ApiResponse({ status: 201, description: 'Workspace created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    create(@Body() dto: CreateWorkspaceDto, @Req() req) {
        return this.workspaceService.create(req.user.userId, dto);
    }

    // ------------------ ALL WORKSPACES ------------------

    @Get()
    @ApiOperation({ summary: 'Get all workspaces of logged in user' })
    findAll(@Req() req) {
        return this.workspaceService.findAll(req.user.userId);
    }

    // ------------------ GET SINGLE WORKSPACE ------------------

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific workspace by ID' })
    @ApiResponse({ status: 404, description: 'Workspace not found' })
    findOne(@Param('id') id: string, @Req() req) {
        return this.workspaceService.findOne(id, req.user.userId);
    }

    // ------------------ UPDATE WORKSPACE ------------------

    @Put(':id')
    @ApiOperation({ summary: 'Update a workspace (only owner can update)' })
    @ApiResponse({ status: 200, description: 'Workspace updated successfully' })
    @ApiResponse({ status: 404, description: 'Workspace not found or not authorized' })
    update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto, @Req() req) {
        return this.workspaceService.update(id, dto, req.user.userId);
    }

    // ------------------ DELETE WORKSPACE ------------------

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a workspace (only owner can delete)' })
    @ApiResponse({ status: 200, description: 'Workspace deleted successfully' })
    @ApiResponse({ status: 404, description: 'Workspace not found or not authorized' })
    remove(@Param('id') id: string, @Req() req) {
        return this.workspaceService.remove(id, req.user.userId);
    }

    // ------------------ INVITE MEMBER TO WORKSPACE ------------------

    @Post(':id/invite')
    @ApiOperation({ summary: 'Invite a member to workspace' })
    @ApiResponse({ status: 200, description: 'Invitation sent successfully' })
    @ApiResponse({ status: 403, description: 'Not authorized' })
    inviteMember(@Param('id') id: string, @Body() dto: InviteMemberDto, @Req() req) {
        return this.workspaceService.inviteMember(id, dto, req.user.userId);
    }

    // ------------------ REMOVE MEMBER FROM WORKSPACE ------------------

    @Delete(':id/members/:userId')
    @ApiOperation({ summary: 'Remove a member from workspace' })
    @ApiResponse({ status: 200, description: 'Member removed successfully' })
    @ApiResponse({ status: 403, description: 'Not authorized' })
    removeMember(@Param('id') id: string, @Param('userId') userId: string, @Req() req) {
        return this.workspaceService.removeMember(id, userId, req.user.userId);
    }
}
