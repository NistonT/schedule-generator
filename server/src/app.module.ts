import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { GroupsModule } from './groups/groups.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ScheduleModule, CabinetsModule, GroupsModule, TeachersModule],
})
export class AppModule {}
