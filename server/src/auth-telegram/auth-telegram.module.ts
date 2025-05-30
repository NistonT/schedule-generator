import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthTelegramController } from './auth-telegram.controller';
import { AuthTelegramService } from './auth-telegram.service';

@Module({
  controllers: [AuthTelegramController],
  providers: [AuthTelegramService, PrismaService],
})
export class AuthTelegramModule {}
