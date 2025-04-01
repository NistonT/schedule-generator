import { Module } from '@nestjs/common';
import { MapTeacherService } from './map_teacher.service';
import { MapTeacherController } from './map_teacher.controller';

@Module({
  controllers: [MapTeacherController],
  providers: [MapTeacherService],
})
export class MapTeacherModule {}
