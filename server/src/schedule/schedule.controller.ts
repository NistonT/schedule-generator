import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // Генерирование расписание по url:
  // POST localhost:5555/api/schedule/generate:
  /* Body
    "cabinets": [
    "333"
  ],
  "groups": [
    "Г1"
  ],
  "teachers": [
    {
      "tid": 0,
      "name": "йцвйцв"
    }
  ],
  "subjectsMap": {
    "Г1": [
      "qwdqwd"
    ]
  },
  "teachersMap": [
    {
      "tid": 0,
      "subject": "qwdqwd",
      "group": "Г1"
    }
  ],
  "amountLimits": [
    {
      "group": "Г1",
      "subject": "qwdqwd",
      "amount": 10,
      "lessonType": "1"
    }
  ],
  "cabinetLimits": [],
  "days": 3,
  "maxLoad": 6,
  "hours": {
    "Г1": [
      0,
      0
    ]
  }
  */
  @Post('generate')
  async generate(@Body() data: any, @Query('api-key') api_key: string) {
    if (!api_key || api_key.trim() === '') {
      throw new HttpException(
        'Требуется API-ключ, который не должен быть пустым',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.scheduleService.generatedSchedulePrisma(api_key, data);
  }

  // Получение расписание через api-key по url:
  // GET localhost:5555/api/schedule/generate
  @Get('generate')
  async getByGenerate(@Query('api-key') api_key) {
    return await this.scheduleService.getBySchedule(api_key);
  }
}
