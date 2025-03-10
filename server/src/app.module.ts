import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ScheduleModule],
})
export class AppModule {}
