import { Body, Controller, Get, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { JwtAuthGuard } from './jwt-auth-guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // ------------------ REGISTER ------------------
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account. A verification email will be sent to the provided email address.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully, verification mail sent',
    schema: {
      example: {
        message:
          'Registration successful, Check your email to verify your account.',
        verification_Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Email already registered or validation error',
    schema: {
      example: {
        status: 400,
        message: 'Email already registered with another account',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        status: 500,
        message: 'Internal server error',
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ------------------ VERIFY EMAIL ------------------

  @Get('verify-email')
  @ApiOperation({
    summary: 'Verify email with Verification Token',
    description: 'Verify user email address using the token sent via email',
  })
  @ApiQuery({
    name: 'token',
    example: '2f1a7c3e9d4f6b8c0a1d2e3f',
    description: 'Token sent to user email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: { example: { message: 'Email verified successfully' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
    schema: { example: { statusCode: 400, message: 'Invalid token' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        status: 500,
        message: 'Internal server error',
      },
    },
  })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ------------------ LOGIN ------------------

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({ type: LoginDto, description: 'Email and Password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials or account not verified',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid credentials',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        status: 500,
        message: 'Internal server error',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ------------------ FORGOT PASSWORD ------------------

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto, description: 'Email to send reset link' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    schema: {
      example: {
        message: 'Check your email for password reset instructions',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email not registered',
    schema: { example: { statusCode: 400, message: 'Email not registered' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        status: 500,
        message: 'Internal server error',
      },
    },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // ------------------ RESET PASSWORD ------------------

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'reset_Password_token + New password',
  })
  @ApiResponse({
    status: 201,
    description: 'Password reset successful',
    schema: { example: { message: 'Password reset successful' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
    schema: { example: { statusCode: 400, message: 'Token expired' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        status: 500,
        message: 'Internal server error',
      },
    },
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
  // FALTU

  @Patch('hello')
  getHello(message: string) {
    return this.authService.getHello(message)
  }

  @Put('put')
  getPut(message: string) {
    return this.authService.getHello(message)
  }



}



