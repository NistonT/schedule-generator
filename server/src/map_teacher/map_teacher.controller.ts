import { Controller } from '@nestjs/common';
import { MapTeacherService } from './map_teacher.service';

@Controller('map-teacher')
export class MapTeacherController {
  constructor(private readonly mapTeacherService: MapTeacherService) {}
}
