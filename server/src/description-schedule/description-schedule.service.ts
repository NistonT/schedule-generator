import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from 'src/schedule/schedule.default.service';

@Injectable()
export class DescriptionScheduleService {
  constructor(
    private prisma: PrismaService,
    private scheduleDefaultService: ScheduleDefaultService,
  ) {}

  // Добавить описание
  async add(text: string, apiKey: string, scheduleId: string) {
    if (!text) {
      throw new BadRequestException('Вы не ввели описание');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    if (!scheduleId) {
      throw new BadRequestException('Вы не ввели идентификатор');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    const descriptionSchedule = await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        description: text,
      },
    });

    return descriptionSchedule.description;
  }

  // Изменить описание
  async put(text: string, apiKey: string, scheduleId: string) {
    if (!text) {
      throw new BadRequestException('Вы не ввели описание');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    if (!scheduleId) {
      throw new BadRequestException('Вы не ввели идентификатор');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    const descriptionSchedule = await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        description: text,
      },
    });

    return descriptionSchedule.description;
  }

  // Удалить описание
  async delete(apiKey: string, scheduleId: string) {
    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    if (!scheduleId) {
      throw new BadRequestException('Вы не ввели идентификатор');
    }

    const schedule = await this.scheduleDefaultService.getScheduleById(
      apiKey,
      scheduleId,
    );

    const descriptionSchedule = await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        description: '',
      },
    });

    return descriptionSchedule;
  }
}
