import { Injectable } from '@nestjs/common';
// import * as sgMail from '@sendgrid/mail';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('SENDGRID_API_KEY is not set in .env filed');
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    const sender = process.env.EMAIL_FROM;
    if (!sender) throw new Error('EMAIL_FROM is not set in .env');

    const msg = {
      to,
      from: sender,
      subject: 'Verify Your Email',
      html: `<p>Verify your email</p>
            <p>Click <a href='${verificationLink}'>here</a> to verify your email.</p>`,
    };
    await sgMail.send(msg);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;

    const sender = process.env.EMAIL_FROM;
    if (!sender) throw new Error('EMAIL_FROM is not set in .env');

    const msg = {
      to,
      from: sender,
      subject: 'Reset Your Password',
      html: `<p>Reset your password</p>
            <p>Click <a href='${resetLink}'>here</a> to reset your password. Link expires in 1 hour.</p>`,
    };
    await sgMail.send(msg);
  }
}
