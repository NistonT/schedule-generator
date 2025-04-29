import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';

@Injectable()
export class ShowScheduleService {
  constructor(
    private prisma: PrismaService,
    private scheduleDefaultService: ScheduleDefaultService,
  ) {}

  // Переключение состояния расписания
  public async switch(apiKey: string, scheduleId: string) {
    if (!apiKey) {
      throw new BadRequestException('Ключ api не обнаружен');
    }

    if (!scheduleId) {
      throw new BadRequestException('Идентификатор расписания не обнаружен');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    const showSchedule = await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        isShow: !schedule.isShow,
      },
    });

    return showSchedule;
  }
}
