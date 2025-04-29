import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Teacher } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private async validateUser(apiKey: string) {
    if (!apiKey?.trim()) {
      throw new BadRequestException('API ключ обязателен');
    }

    const user = await this.userService.getByApiKey(apiKey);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  public async add(
    name: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<Teacher> {
    if (!name?.trim()) {
      throw new BadRequestException('Имя преподавателя обязательно');
    }

    const user = await this.validateUser(apiKey);

    // Если scheduleId не указан, используем последнее расписание пользователя
    const targetSchedule = scheduleId
      ? await this.prisma.schedule.findFirst({
          where: { id: scheduleId, user_id: user.id },
        })
      : await this.prisma.schedule.findFirst({
          where: { user_id: user.id },
          orderBy: { CreatedAt: 'desc' },
        });

    if (!targetSchedule) {
      throw new NotFoundException('Расписание не найдено');
    }

    // Проверяем существование преподавателя
    const existingTeacher = await this.prisma.teacher.findFirst({
      where: {
        name,
        schedule: { some: { id: targetSchedule.id } },
      },
    });

    if (existingTeacher) {
      throw new BadRequestException('Этот преподаватель уже существует');
    }

    // Создаем преподавателя и связываем с расписанием
    return this.prisma.teacher.create({
      data: {
        name,
        schedule: {
          connect: { id: targetSchedule.id },
        },
      },
    });
  }

  public async get(apiKey: string, scheduleId?: string): Promise<Teacher[]> {
    const user = await this.validateUser(apiKey);

    const where = scheduleId
      ? {
          schedule: {
            some: {
              id: scheduleId,
              user_id: user.id,
            },
          },
        }
      : {
          schedule: {
            some: {
              user_id: user.id,
            },
          },
        };

    return this.prisma.teacher.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  public async getAllTeachers(apiKey: string): Promise<Teacher[]> {
    // Валидация пользователя
    const user = await this.validateUser(apiKey);

    // Получаем все расписания пользователя с преподавателями
    const schedules = await this.prisma.schedule.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        teachers: {
          orderBy: {
            name: 'asc', // Сортировка преподавателей по имени
          },
        },
      },
    });

    // Объединяем всех преподавателей из всех расписаний
    const allTeachers = schedules.flatMap((schedule) => schedule.teachers);

    // Удаляем дубликаты преподавателей (если один преподаватель в нескольких расписаниях)
    const uniqueTeachers = allTeachers.filter(
      (teacher, index, self) =>
        index === self.findIndex((t) => t.tid === teacher.tid),
    );

    return uniqueTeachers;
  }

  public async change(
    teacherId: number,
    newName: string,
    apiKey: string,
  ): Promise<Teacher> {
    if (!newName?.trim()) {
      throw new BadRequestException('Новое имя преподавателя обязательно');
    }

    await this.validateUser(apiKey);

    // Проверяем существование преподавателя
    const teacher = await this.prisma.teacher.findUnique({
      where: { tid: teacherId },
      include: { schedule: true },
    });

    if (!teacher) {
      throw new NotFoundException('Преподаватель не найден');
    }

    // Проверяем уникальность нового имени
    const nameExists = await this.prisma.teacher.findFirst({
      where: {
        name: newName,
        tid: { not: teacherId },
        schedule: { some: { id: { in: teacher.schedule.map((s) => s.id) } } },
      },
    });

    if (nameExists) {
      throw new BadRequestException(
        'Преподаватель с таким именем уже существует',
      );
    }

    return this.prisma.teacher.update({
      where: { tid: teacherId },
      data: { name: newName },
    });
  }

  public async delete(teacherId: number, apiKey: string): Promise<Teacher> {
    // Валидация пользователя
    const user = await this.validateUser(apiKey);

    // Находим преподавателя с проверкой, что он принадлежит пользователю
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        tid: teacherId, // Убедитесь, что teacherId передается правильно
      },
      include: {
        schedule: {
          where: {
            user_id: user.id, // Проверяем принадлежность расписания пользователю
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Преподаватель не найден');
    }

    // Дополнительная проверка, что преподаватель принадлежит пользователю
    if (teacher.schedule.length === 0) {
      throw new NotFoundException('Преподаватель не принадлежит пользователю');
    }

    // Удаляем преподавателя
    return await this.prisma.teacher.delete({
      where: {
        tid: teacherId,
      },
    });
  }
}
