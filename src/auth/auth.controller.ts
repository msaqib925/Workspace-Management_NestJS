import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto, description: 'Email, Name and Password' })

    @ApiResponse({ status: 201, description: 'User registered successfully' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login User' })
    @ApiBody({ type: LoginDto, description: 'Email and Password' })

    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get('verify-email')
    @ApiOperation({ summary: 'Verify email with Verification Token' })
    @ApiResponse({ status: 201, description: 'User verified successfully' })
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiBody({ type: ForgotPasswordDto, description: 'Email to send reset link' })
    @ApiResponse({ status: 201, description: 'Reset password token sent to your email' })
    forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto)
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token' })
    @ApiBody({ type: ResetPasswordDto, description: 'Token + New password' })
    @ApiResponse({ status: 201, description: 'Password reset successfully' })
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto)
    }
}
