import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmountLimitsModule } from './amount_limits/amount_limits.module';
import { AuthModule } from './auth/auth.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { DescriptionScheduleModule } from './description-schedule/description-schedule.module';
import { GroupsModule } from './groups/groups.module';
import { LimitCabinetsModule } from './limit_cabinets/limit_cabinets.module';
import { MapSubjectModule } from './map_subject/map_subject.module';
import { MapTeacherModule } from './map_teacher/map_teacher.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ShowScheduleModule } from './show-schedule/show-schedule.module';
import { SubjectModule } from './subject/subject.module';
import { TeachersModule } from './teachers/teachers.module';
import { TitleScheduleModule } from './title-schedule/title-schedule.module';
import { UserModule } from './user/user.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ScheduleModule,
    CabinetsModule,
    GroupsModule,
    TeachersModule,
    MapSubjectModule,
    MapTeacherModule,
    AmountLimitsModule,
    LimitCabinetsModule,
    SubjectModule,
    TitleScheduleModule,
    DescriptionScheduleModule,
    ShowScheduleModule,
    FeedbackModule,
  ],
})
export class AppModule {}
