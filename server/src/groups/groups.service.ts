import { BadRequestException, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { Groups } from './dto/groups.types';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Добавленние группы
  async add(name: string, apiKey: string): Promise<Schedule> {
    if (!name) {
      throw new BadRequestException('Вы не ввели название группы');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const filterGroups = schedule.groups.filter((group) => {
      return group === name;
    });

    if (filterGroups.length > 0) {
      throw new BadRequestException(`Группа ${name} уже создана`);
    }

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        groups: {
          push: name,
        },
      },
    });
  }

  // Вывод групп
  async get(apiKey: string): Promise<Groups[]> {
    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return await this.prisma.schedule.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        groups: true,
      },
    });
  }

  // Изменить группу
  async change(
    oldName: string,
    newName: string,
    apiKey: string,
  ): Promise<Schedule> {
    if (!oldName) {
      throw new BadRequestException('Вы не ввели название группы');
    }

    if (!newName) {
      throw new BadRequestException('Вы не ввели новое название группы');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const groupIndex = schedule.groups.indexOf(oldName);

    if (groupIndex === -1) {
      throw new BadRequestException('Группа не найдена');
    }

    const groupUpdate = [...schedule.groups];
    groupUpdate[groupIndex] = newName;

    const filterGroup = schedule.groups.filter((group) => group === newName);

    if (filterGroup.length > 0) {
      throw new BadRequestException('Имя группы уже занято');
    }

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        groups: groupUpdate,
      },
    });
  }

  // Удалить группу
  async delete(name: string, apiKey: string): Promise<Schedule> {
    if (!name) {
      throw new BadRequestException('Вы не ввели название группы');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const filterGroup = schedule.groups.filter((group) => group !== name);

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        groups: filterGroup,
      },
    });
  }
}
