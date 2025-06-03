import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
      throw new UnauthorizedException('API ключ обязателен');
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

  public async addGroup(
    names: string[],
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!Array.isArray(names)) {
      throw new BadRequestException(
        'Группы должны быть переданы в виде массива',
      );
    }

    if (names.length === 0) {
      throw new BadRequestException('Необходимо указать хотя бы одну группу');
    }

    for (const name of names) {
      if (!name?.trim()) {
        throw new BadRequestException('Название группы обязательно');
      }
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Фильтруем уникальные группы
    const uniqueNames = names.filter((name) => !schedule.groups.includes(name));

    if (uniqueNames.length === 0) {
      return schedule.groups; // Все группы уже существуют
    }

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        groups: {
          push: uniqueNames,
        },
      },
    });

    return updatedSchedule.groups;
  }

  public async getGroups(
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);
    return schedule.groups;
  }

  public async getAllGroups(
    apiKey: string,
  ): Promise<{ id: string; groups: string[] }[]> {
    const user = await this.validateUserAndSchedule(apiKey);
    const schedules = await this.prisma.schedule.findMany({
      where: { user_id: user.user.id },
      select: { id: true, groups: true },
    });
    return schedules;
  }

  public async changeGroup(
    oldName: string,
    newName: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!oldName?.trim()) {
      throw new BadRequestException('Текущее название группы обязательно');
    }
    if (!newName?.trim()) {
      throw new BadRequestException('Новое название группы обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    const groupIndex = schedule.groups.indexOf(oldName);
    if (groupIndex === -1) {
      throw new NotFoundException(`Группа "${oldName}" не найдена`);
    }

    if (schedule.groups.includes(newName)) {
      throw new ConflictException(`Группа "${newName}" уже существует`);
    }

    const updatedGroups = [...schedule.groups];
    updatedGroups[groupIndex] = newName;

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { groups: updatedGroups },
    });

    return updatedSchedule.groups;
  }

  public async deleteGroup(
    name: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!name?.trim()) {
      throw new BadRequestException('Название группы обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    if (!schedule.groups.includes(name)) {
      throw new NotFoundException(`Группа "${name}" не найдена`);
    }

    const updatedGroups = schedule.groups.filter((g) => g !== name);

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { groups: updatedGroups },
    });

    return updatedSchedule.groups;
  }
}
