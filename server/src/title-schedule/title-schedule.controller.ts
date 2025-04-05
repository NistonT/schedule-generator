import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { TitleScheduleService } from './title-schedule.service';

@Controller('title-schedule')
export class TitleScheduleController {
  constructor(private readonly titleScheduleService: TitleScheduleService) {}

  // Добавляет название к расписанию
  @Post()
  async add(
    @Body('title') title: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.titleScheduleService.add(title, apiKey, scheduleId);
  }

  // Изменить название в расписания
  @Put()
  async put(
    @Body('title') title: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.titleScheduleService.put(title, apiKey, scheduleId);
  }

  // Удалить название в расписание
  @Delete()
  async delete(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.titleScheduleService.delete(apiKey, scheduleId);
  }
}
