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
    {
      "cabinets": [
        "228",
        "224",
        "231",
        "328",
        "324",
        "331",
        "428",
        "424",
        "431"
      ],
      "groups": [
        "Г1"
      ],
      "teachers": [
        {
          "tid": 1,
          "name": "Шакурова"
        },
        {
          "tid": 2,
          "name": "Сабирова"
        },
        {
          "tid": 3,
          "name": "Рамазанова"
        },
        {
          "tid": 4,
          "name": "Галиев"
        },
        {
          "tid": 5,
          "name": "Сальманов"
        }
      ],
      "subjectsMap": {
        "Г1": [
          "П-1",
          "П-3",
          "П-1_1",
          "П-1_2"
        ]
      },
      "teachersMap": [
        {
          "tid": 1,
          "subject": "П-1",
          "group": "Г1"
        },
        {
          "tid": 3,
          "subject": "П-3",
          "group": "Г1"
        },
        {
          "tid": 4,
          "subject": "П-1",
          "group": "Г1"
        },
        {
          "tid": 5,
          "subject": "П-1",
          "group": "Г1"
        }
      ],
      "amountLimits": [
        {
          "group": "Г1",
          "subject": "П-3",
          "amount": 10,
          "lessonType": "L"
        },
        {
          "group": "Г1",
          "subject": "П-1",
          "amount": 3,
          "lessonType": "L"
        },
        {
          "group": "Г1",
          "subject": "П-1",
          "amount": 5,
          "lessonType": "1"
        },
        {
          "group": "Г1",
          "subject": "П-1",
          "amount": 4,
          "lessonType": "2"
        }
      ],
      "cabinetLimits": [
        {
          "tid": 1,
          "cabinets": [
            "228",
            "231"
          ]
        },
        {
          "tid": 3,
          "cabinets": [
            "224",
            "231"
          ]
        },
        {
          "tid": 4,
          "cabinets": [
            "224",
            "231",
            "324"
          ]
        },
        {
          "tid": 5,
          "cabinets": [
            "228",
            "231",
            "328"
          ]
        }
      ],
      "days": 1,
      "maxLoad": 6,
      "hours": {
        "Г1": [
          0,
          0
        ]
      }
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
