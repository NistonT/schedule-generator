import { Module } from '@nestjs/common';
import { LimitCabinetsService } from './limit_cabinets.service';
import { LimitCabinetsController } from './limit_cabinets.controller';

@Module({
  controllers: [LimitCabinetsController],
  providers: [LimitCabinetsService],
})
export class LimitCabinetsModule {}
