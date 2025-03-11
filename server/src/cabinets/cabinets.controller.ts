import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { CabinetsService } from './cabinets.service';
import { Cabinets } from './dto/cabinets.type';
import { ChangeCabinetDto } from './dto/change.type';

@Controller('cabinets')
export class CabinetsController {
  constructor(private readonly cabinetsService: CabinetsService) {}

  /*

  У всех url одиннаковый (localhost:5555/api/cabinets), но различаются только методы

  */

  /*
    {
	    "name": String
    }
  */
  @Post()
  async add(
    @Body('name') name: string,
    @Query('api-key') api_key: string,
  ): Promise<Schedule> {
    return await this.cabinetsService.addCabinet(name, api_key);
  }

  @Get()
  async get(@Query('api-key') api_key: string): Promise<Cabinets[]> {
    return await this.cabinetsService.getCabinets(api_key);
  }

  /*
    {
	    "oldName": String,
      "newName": String
    }
  */
  @UsePipes(new ValidationPipe())
  @Put()
  async change(
    @Body() dto: ChangeCabinetDto,
    @Query('api-key') api_key: string,
  ): Promise<Schedule> {
    const { oldName, newName } = dto;

    return await this.cabinetsService.changeCabinet(oldName, newName, api_key);
  }

  /*
    {
	    "name": String
    }
  */
  @Delete()
  async delete(
    @Body('name') name: string,
    @Query('api-key') api_key: string,
  ): Promise<Schedule> {
    return this.cabinetsService.deleteCabinet(name, api_key);
  }
}
