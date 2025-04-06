import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';

@Injectable()
export class ShowScheduleService {
  constructor(
    private prisma: PrismaService,
    private scheduleDefaultService: ScheduleDefaultService,
  ) {}

  async switch(state: boolean, apiKey: string, scheduleId: string) {
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

    switch (state) {
      case true:
        return await this.prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            isShow: false,
          },
        });
      case false:
        return await this.prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            isShow: true,
          },
        });
      default:
        throw new BadRequestException('Ошибка состояния расписания');
    }
  }
}
