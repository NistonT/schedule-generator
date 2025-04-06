import { Body, Controller, Post, Query } from '@nestjs/common';
import { ShowScheduleService } from './show-schedule.service';

@Controller('show-schedule')
export class ShowScheduleController {
  constructor(private readonly showScheduleService: ShowScheduleService) {}

  @Post()
  async switch(
    @Body('isShow') state: boolean,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    return await this.showScheduleService.switch(state, apiKey, scheduleId);
  }
}
