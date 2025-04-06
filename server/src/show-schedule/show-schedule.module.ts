import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';
import { UserService } from 'src/user/user.service';
import { ShowScheduleController } from './show-schedule.controller';
import { ShowScheduleService } from './show-schedule.service';

@Module({
  controllers: [ShowScheduleController],
  providers: [
    ShowScheduleService,
    PrismaService,
    ScheduleDefaultService,
    UserService,
  ],
})
export class ShowScheduleModule {}
