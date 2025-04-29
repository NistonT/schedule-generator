import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';

@Injectable()
export class TitleScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleDefaultService: ScheduleDefaultService,
  ) {}

  /*
		Сервис для добавление, вывода, изменение и удаление название в расписание.
	*/

  // Добавление название
  public async add(title: string, apiKey: string, scheduleId: string) {
    if (!title) {
      throw new BadRequestException('Введите название расписание');
    }

    if (!apiKey) {
      throw new BadRequestException('Введи ключ api');
    }

    if (!scheduleId) {
      throw new BadRequestException('Введите идентификтор расписания');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    return await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        title,
      },
    });
  }

  // Изменение название
  public async put(title: string, apiKey: string, scheduleId: string) {
    if (!title) {
      throw new BadRequestException('Вы не ввели новое название');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    if (!scheduleId) {
      throw new BadRequestException('Вы не ввели идентификатор расписания');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    return await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        title: title,
      },
    });
  }

  // Удаление название
  public async delete(apiKey: string, scheduleId: string) {
    if (!apiKey) {
      throw new BadRequestException('Вы не ввели api ключ');
    }

    if (!scheduleId) {
      throw new BadRequestException('Вы не ввели идентификатор расписания');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    const title = await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        title: 'Расписание',
      },
    });

    return title;
  }
}
