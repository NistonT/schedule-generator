import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private async validateUserAndSchedule(apiKey: string, scheduleId?: string) {
    if (!apiKey?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }

    const user = await this.userService.getByApiKey(apiKey);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const schedule = scheduleId
      ? await this.prisma.schedule.findFirst({
          where: { id: scheduleId, user_id: user.id },
        })
      : await this.prisma.schedule.findFirst({
          where: { user_id: user.id },
          orderBy: { CreatedAt: 'desc' },
        });

    if (!schedule) {
      throw new NotFoundException('Расписание не найдено');
    }

    return { user, schedule };
  }

  public async add(name: string, apiKey: string, scheduleId?: string) {
    if (!name?.trim()) {
      throw new BadRequestException('Название группы обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Проверяем существование группы
    if (schedule.groups.includes(name)) {
      throw new BadRequestException(`Группа "${name}" уже существует`);
    }

    return this.prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        groups: {
          push: name,
        },
      },
    });
  }

  public async get(apiKey: string, scheduleId?: string): Promise<string[]> {
    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);
    return schedule.groups;
  }

  public async getAll(
    apiKey: string,
  ): Promise<{ id: string; groups: string[] }[]> {
    const user = await this.validateUserAndSchedule(apiKey);
    const schedules = await this.prisma.schedule.findMany({
      where: { user_id: user.user.id },
      select: { id: true, groups: true },
    });
    return schedules;
  }

  public async change(
    oldName: string,
    newName: string,
    apiKey: string,
    scheduleId?: string,
  ) {
    if (!oldName?.trim()) {
      throw new BadRequestException('Текущее название группы обязательно');
    }
    if (!newName?.trim()) {
      throw new BadRequestException('Новое название группы обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Проверяем существование старой группы
    const groupIndex = schedule.groups.indexOf(oldName);
    if (groupIndex === -1) {
      throw new NotFoundException(`Группа "${oldName}" не найдена`);
    }

    // Проверяем уникальность нового имени
    if (schedule.groups.includes(newName)) {
      throw new BadRequestException(`Группа "${newName}" уже существует`);
    }

    // Обновляем массив групп
    const updatedGroups = [...schedule.groups];
    updatedGroups[groupIndex] = newName;

    return this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { groups: updatedGroups },
    });
  }

  public async delete(name: string, apiKey: string, scheduleId?: string) {
    if (!name?.trim()) {
      throw new BadRequestException('Название группы обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Проверяем существование группы
    if (!schedule.groups.includes(name)) {
      throw new NotFoundException(`Группа "${name}" не найдена`);
    }

    // Фильтруем массив групп
    const updatedGroups = schedule.groups.filter((group) => group !== name);

    return this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { groups: updatedGroups },
    });
  }
}
