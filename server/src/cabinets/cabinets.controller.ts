import { Body, Controller, Post, Query } from '@nestjs/common';
import { CabinetsService } from './cabinets.service';

@Controller('cabinets')
export class CabinetsController {
  constructor(private readonly cabinetsService: CabinetsService) {}

  @Post('/add')
  async add(@Body('name') name: string, @Query('api-key') api_key: string) {
    return this.cabinetsService.addCabinet(name, api_key);
  }
}
