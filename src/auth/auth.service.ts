import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email/email.service';
import { randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new BadRequestException('Email already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const verificationToken = randomBytes(32).toString('hex');

        const user = await this.prisma.user.create({
            data: { email: dto.email, name: dto.name, password: hashedPassword, verificationToken },
        });

        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return {
            message: 'Registration successful, Check your email to verify your account.'
        }
    }

    async verifyEmail(token: string) {
        const user = await this.prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) throw new BadRequestException('Invalid or expired token');

        await this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null }
        });

        return { message: 'Email verified successfully' }
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (!user.isVerified) throw new UnauthorizedException('Email not verified');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        return { user, token }
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new BadRequestException('Email not registered');

        const token = randomBytes(32).toString('hex')
        const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour later

        await this.prisma.user.update({ where: { id: user.id }, data: { resetPasswordToken: token, resetTokenExpiry: expiry } });
        await this.emailService.sendResetPasswordEmail(user.email, token);

        return { message: 'Check your email for password reset instructions' }
    }

}
