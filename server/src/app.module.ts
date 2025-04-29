import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { DescriptionScheduleModule } from './description-schedule/description-schedule.module';
import { GroupsModule } from './groups/groups.module';

import { ScheduleModule } from './schedule/schedule.module';
import { ShowScheduleModule } from './show-schedule/show-schedule.module';

import { FeedbackModule } from './feedback/feedback.module';
import { TeachersModule } from './teachers/teachers.module';
import { TitleScheduleModule } from './title-schedule/title-schedule.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ScheduleModule,
    CabinetsModule,
    GroupsModule,
    TeachersModule,
    TitleScheduleModule,
    DescriptionScheduleModule,
    ShowScheduleModule,
    FeedbackModule,
  ],
})
export class AppModule {}
