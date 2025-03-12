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
import { Schedule, Teacher } from '@prisma/client';
import { ChangeTeachersDto, ITeachers } from './dto/teacher.types';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async add(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
  ): Promise<Schedule> {
    return await this.teachersService.add(name, apiKey);
  }

  @Get()
  async get(@Query('api-key') apiKey: string): Promise<ITeachers[]> {
    return await this.teachersService.get(apiKey);
  }

  @UsePipes(new ValidationPipe())
  @Put()
  async change(
    @Body() dto: ChangeTeachersDto,
    @Query('api-key') apiKey: string,
  ): Promise<Teacher> {
    const { oldName, newName } = dto;
    return await this.teachersService.change(oldName, newName, apiKey);
  }

  @Delete()
  async delete(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
  ): Promise<Teacher> {
    return await this.teachersService.delete(name, apiKey);
  }
}
