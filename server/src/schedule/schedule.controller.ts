import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // @UseInterceptors(TimeoutInterceptor)
  @Post('generate')
  async generate(@Body() data: any) {
    try {
      const timetable = await this.scheduleService.generateSchedule(data);
      return timetable; // Возвращаем только расписание
    } catch (error) {
      return { error: error.message }; // Обработка ошибок
    }
  }
}
