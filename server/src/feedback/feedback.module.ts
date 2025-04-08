import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../user/user.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, UserService, PrismaService],
})
export class FeedbackModule {}
