import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { updateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth('jwt-auth')

@UseGuards(JwtAuthGuard)

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    // ------------------ GET PROFILE ------------------

    @Get('me')
    @ApiOperation({ summary: 'Get current logged in user profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile fetched successfully',
        schema: {
            example: {
                id: '1',
                name: 'Tycoon',
                email: 'appTycoon@gmail.com',
                isVerified: true,
                createdAt: '2025-09-04T12:34:56.000Z',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
    })
    myProfile(@Req() req) {
        return this.profileService.myProfile(req.user.userId)
    }

    // ------------------ UPDATE PROFILE ------------------
    @Post('update')
    @ApiOperation({ summary: 'Update your name or email' })
    @ApiBody({ type: updateProfileDto, description: 'Update Profile' })
    @ApiResponse({
        status: 200,
        description: 'Profile updated successfully',
        schema: {
            example: {
                id: '1',
                name: 'Aaqib',
                email: 'aaqib@gmail.com',
                isVerified: true,
                createdAt: '2025-09-04T12:34:56.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - Email already in use or invalid input',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })

    updateProfile(@Req() req, @Body() dto: updateProfileDto) {
        return this.profileService.updateProfile(req.user.userId, dto)
    }

}
