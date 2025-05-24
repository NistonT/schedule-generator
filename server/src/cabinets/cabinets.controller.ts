import {
  BadRequestException,
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
import { CabinetsService } from './cabinets.service';
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
  public async add(
    @Body() body: { name: string[] }, // Изменено на получение всего body
    @Query('api-key') api_key: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    // Проверяем наличие name в теле запроса
    if (!body.hasOwnProperty('name')) {
      throw new BadRequestException('Поле "name" обязательно');
    }

    return await this.cabinetsService.addCabinet(
      body.name,
      api_key,
      scheduleId,
    );
  }

  @Get()
  public async get(
    @Query('api-key') api_key: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.cabinetsService.getCabinets(api_key, scheduleId);
  }

  @Get('/all')
  public async getAll(
    @Query('api-key') api_key: string,
  ): Promise<{ id: string; cabinets: string[] }[]> {
    return await this.cabinetsService.getAllCabinets(api_key);
  }

  /*
    {
	    "oldName": String,
      "newName": String
    }
  */
  @UsePipes(new ValidationPipe())
  @Put()
  public async change(
    @Body() dto: ChangeCabinetDto,
    @Query('api-key') api_key: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    const { oldName, newName } = dto;

    return await this.cabinetsService.changeCabinet(
      oldName,
      newName,
      api_key,
      scheduleId,
    );
  }

  /*
    {
	    "name": String
    }
  */
  @Delete()
  public async delete(
    @Body('name') name: string,
    @Query('api-key') api_key: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return this.cabinetsService.deleteCabinet(name, api_key, scheduleId);
  }
}
