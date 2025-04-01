import { Controller } from '@nestjs/common';
import { MapSubjectService } from './map_subject.service';

@Controller('map-subject')
export class MapSubjectController {
  constructor(private readonly mapSubjectService: MapSubjectService) {}
}
