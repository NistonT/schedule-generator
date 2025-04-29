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
import { Teacher } from '@prisma/client';
import { ChangeTeachersDto } from './dto/teacher.types';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  public async add(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<Teacher> {
    return await this.teachersService.add(name, apiKey, scheduleId);
  }

  @Get()
  public async get(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<Teacher[]> {
    return await this.teachersService.get(apiKey, scheduleId);
  }

  @Get('/all')
  public async getAll(@Query('api-key') apiKey: string): Promise<Teacher[]> {
    return await this.teachersService.getAllTeachers(apiKey);
  }

  @UsePipes(new ValidationPipe())
  @Put()
  public async change(
    @Body() dto: ChangeTeachersDto,
    @Query('api-key') apiKey: string,
  ): Promise<Teacher> {
    const { teacherId, newName } = dto;
    return await this.teachersService.change(teacherId, newName, apiKey);
  }

  @Delete()
  public async delete(
    @Body('teacher_id') teacherId: number,
    @Query('api-key') apiKey: string,
  ): Promise<Teacher> {
    return await this.teachersService.delete(teacherId, apiKey);
  }
}
