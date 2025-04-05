import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';
import { UserModule } from 'src/user/user.module';
import { DescriptionScheduleController } from './description-schedule.controller';
import { DescriptionScheduleService } from './description-schedule.service';

@Module({
  imports: [UserModule],
  controllers: [DescriptionScheduleController],
  providers: [
    DescriptionScheduleService,
    PrismaService,
    ScheduleDefaultService,
  ],
})
export class DescriptionScheduleModule {}
