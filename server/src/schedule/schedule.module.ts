import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleDefaultService } from './schedule.default.service';
import { ScheduleService } from './schedule.service';
import { ScheduleAiService } from './scheduleAi.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 0,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }),
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    PrismaService,
    UserService,
    ScheduleAiService,
    ScheduleDefaultService,
  ],
  exports: [ScheduleDefaultService, ScheduleService],
})
export class ScheduleModule {}
