import { Controller } from '@nestjs/common';
import { LimitCabinetsService } from './limit_cabinets.service';

@Controller('limit-cabinets')
export class LimitCabinetsController {
  constructor(private readonly limitCabinetsService: LimitCabinetsService) {}
}
