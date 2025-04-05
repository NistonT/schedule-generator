import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';
import { UserModule } from 'src/user/user.module';
import { TitleScheduleController } from './title-schedule.controller';
import { TitleScheduleService } from './title-schedule.service';

@Module({
  imports: [UserModule],
  controllers: [TitleScheduleController],
  providers: [TitleScheduleService, PrismaService, ScheduleDefaultService],
})
export class TitleScheduleModule {}
