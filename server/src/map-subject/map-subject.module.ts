import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { MapSubjectController } from './map-subject.controller';
import { MapSubjectService } from './map-subject.service';

@Module({
  controllers: [MapSubjectController],
  providers: [MapSubjectService, PrismaService],
  imports: [ScheduleModule],
})
export class MapSubjectModule {}
