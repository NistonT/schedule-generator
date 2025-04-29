import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { DescriptionScheduleService } from './description-schedule.service';

@Controller('description-schedule')
export class DescriptionScheduleController {
  constructor(
    private readonly descriptionScheduleService: DescriptionScheduleService,
  ) {}
  /*
    Контроллер добавление, изменение и удаление описание в расписание.
  */

  // Добавляет описание
  @Post()
  public async add(
    @Body('text') text: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.descriptionScheduleService.add(text, apiKey, scheduleId);
  }

  // Изменяет описание
  @Put()
  public async put(
    @Body('text') text: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.descriptionScheduleService.put(text, apiKey, scheduleId);
  }

  // Удаляет описание
  @Delete()
  public async delete(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.descriptionScheduleService.delete(apiKey, scheduleId);
  }
}
