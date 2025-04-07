import { Controller, Post, Query } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';

@Controller('show-schedule')
export class ShowScheduleController {
  constructor(private readonly showScheduleService: ShowScheduleService) {}

  // Переключение состояния расписания
  @Post()
  async switch(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.showScheduleService.switch(apiKey, scheduleId);
  }
}
