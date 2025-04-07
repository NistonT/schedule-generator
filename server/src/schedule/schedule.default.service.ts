import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduleDefaultService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Получение всех расписаний пользователя
  async getAllUserSchedules(api_key: string) {
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.schedule.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isShow: true,
        schedule: true,
        cabinets: true,
        groups: true,
        teachers: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
      orderBy: {
        CreatedAt: 'desc', // Сортировка по дате создания (новые сначала)
      },
    });
  }

  // Получение конкретного расписания по ID
  async getScheduleById(api_key: string, scheduleId: string) {
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        user_id: user.id, // Проверка что расписание принадлежит пользователю
      },
      select: {
        id: true,
        schedule: true,
        cabinets: true,
        groups: true,
        teachers: true,
        CreatedAt: true,
        UpdatedAt: true,
        title: true,
        description: true,
        isShow: true,
      },
    });
  }

  // Получение последнего активного расписания
  async getLatestSchedule(api_key: string) {
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.schedule.findFirst({
      where: {
        user_id: user.id,
        isShow: true, // Только активные расписания
      },
      select: {
        id: true,
        schedule: true,
        cabinets: true,
        groups: true,
        teachers: true,
        title: true,
        description: true,
        isShow: true,
      },
      orderBy: {
        CreatedAt: 'desc', // Берем самое новое
      },
    });
  }
}
