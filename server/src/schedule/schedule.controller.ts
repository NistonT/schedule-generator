import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ScheduleDefaultService } from './schedule.default.service';
import { ScheduleService } from './schedule.service';
import { ScheduleAiService } from './scheduleAi.service';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly scheduleAiService: ScheduleAiService,
    private readonly scheduleDefaultService: ScheduleDefaultService,
  ) {}

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
  @HttpCode(HttpStatus.OK)
  async generate(
    @Body() data: any,
    @Query('api-key') api_key: string,
    @Query('schedule_id') scheduleId: string,
  ) {
    if (!api_key?.trim()) {
      throw new BadRequestException(
        'Требуется API-ключ, который не должен быть пустым',
      );
    }

    return await this.scheduleService.generatedSchedulePrisma(
      api_key,
      scheduleId,
      data,
    );
  }

  @Post('generateAi')
  @HttpCode(HttpStatus.CREATED)
  async generateAi(@Body() data: any) {
    return await this.scheduleAiService.generateSchedule(data);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() data: any, @Query('api-key') api_key: string) {
    if (!api_key?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }
    return await this.scheduleService.addGeneratedSchedulePrisma(api_key, data);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getUserSchedules(@Query('api-key') api_key: string) {
    if (!api_key?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }
    return await this.scheduleService.getAllUserSchedules(api_key);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getScheduleById(
    @Query('schedule_id') scheduleId: string,
    @Query('api-key') api_key: string,
  ) {
    if (!api_key?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }
    return await this.scheduleService.getScheduleById(api_key, scheduleId);
  }

  // default Service

  @Get('/users/all')
  @HttpCode(HttpStatus.OK)
  async getAllUserSchedules(@Query('api-key') api_key: string) {
    if (!api_key?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }
    return await this.scheduleDefaultService.getAllUserSchedules(api_key);
  }

  @Get('/latest')
  @HttpCode(HttpStatus.OK)
  async getLatestSchedule(@Query('api-key') api_key: string) {
    if (!api_key?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }
    return await this.scheduleDefaultService.getLatestSchedule(api_key);
  }
}
