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
import { ChangeTeachersDto } from './dto/teacher.types';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  /*
    POST /teachers?api-key=KEY&schedule_id=ID
    {
      "name": ["ИВТ-2-1", "ИВТ-2-2"]
    }
  */
  @Post()
  public async add(
    @Body() body: { name: string[] },
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    if (!body.hasOwnProperty('name')) {
      throw new BadRequestException('Поле "name" обязательно');
    }

    return await this.teachersService.addTeacher(body.name, apiKey, scheduleId);
  }

  /*
    GET /teachers?api-key=KEY&schedule_id=ID
  */
  @Get()
  public async get(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.teachersService.getTeachers(apiKey, scheduleId);
  }

  /*
    GET /teachers/all?api-key=KEY
  */
  @Get('/all')
  public async getAll(
    @Query('api-key') apiKey: string,
  ): Promise<{ id: string; teachers: string[] }[]> {
    return await this.teachersService.getAllTeachers(apiKey);
  }

  /*
    PUT /teachers?api-key=KEY&schedule_id=ID
    {
      "oldName": "ИВТ-2-1",
      "newName": "ИВТ-2-2"
    }
  */
  @UsePipes(new ValidationPipe())
  @Put()
  public async change(
    @Body() dto: ChangeTeachersDto,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    const { oldName, newName } = dto;

    return await this.teachersService.changeTeacher(
      oldName,
      newName,
      apiKey,
      scheduleId,
    );
  }

  /*
    DELETE /teachers?api-key=KEY&schedule_id=ID
    {
      "name": "ИВТ-2-1"
    }
  */
  @Delete()
  public async delete(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.teachersService.deleteTeacher(name, apiKey, scheduleId);
  }
}
