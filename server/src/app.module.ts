import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { GroupsModule } from './groups/groups.module';
import { TeachersModule } from './teachers/teachers.module';
import { MapSubjectModule } from './map_subject/map_subject.module';
import { MapTeacherModule } from './map_teacher/map_teacher.module';
import { AmountLimitsModule } from './amount_limits/amount_limits.module';
import { LimitCabinetsModule } from './limit_cabinets/limit_cabinets.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ScheduleModule, CabinetsModule, GroupsModule, TeachersModule, MapSubjectModule, MapTeacherModule, AmountLimitsModule, LimitCabinetsModule, SubjectModule],
})
export class AppModule {}
