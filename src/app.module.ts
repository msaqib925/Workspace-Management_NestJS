import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module'
import { WorkspaceModule } from './workspace/workspace.module';
import { BrandModule } from './brand/brand.module';
import { CampaignModule } from './campaign/campaign.module';
import Joi from 'joi';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.string().default('1d'),
    }),
  }), PrismaModule, AuthModule, ProfileModule, WorkspaceModule, BrandModule, CampaignModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
