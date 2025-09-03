import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email/email.service';
import { randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  // ------------------ REGISTER ------------------
  async register(dto: RegisterDto) {
    const ownerExists = await this.prisma.user.findFirst({
      where: { role: 'OWNER' },
    });

    const role = ownerExists ? 'USER' : 'OWNER';

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        verificationToken,
        role,
      },
    });

    await this.emailService.sendVerificationEmail(
      user.email, verificationToken,
    );
    return {
      message:
        'Registration successful, Check your email to verify your account.', verificationToken,
    };
  }
  // ------------------ VERIFY EMAIL ------------------

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return { message: 'Email verified successfully' };
  }
  // ------------------ LOGIN ------------------

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) throw new UnauthorizedException('Email not verified');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return { access_token: token };
  }

  // ------------------ FORGOT PASSWORD ------------------

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException('Email not registered');

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetTokenExpiry: expiry },
    });
    await this.emailService.sendResetPasswordEmail(user.email, token);

    return {
      message: 'Check your email for password reset instructions',
      reset_Password_token: token,
    };
  }

  // ------------------ RESET PASSWORD ------------------

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: dto.token },
    });
    if (!user) throw new BadRequestException('Invalid token');
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date())
      throw new BadRequestException('Token expired');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetPasswordToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }
  async getHello(message: string) {
    return { message: 'Hey im good' }
  }
  async getPut(message: string) {
    return { message: 'Hey im good' }
  }
}
