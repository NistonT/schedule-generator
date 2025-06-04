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
export class TeachersService {
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

  public async addTeacher(
    names: string[],
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!Array.isArray(names)) {
      throw new BadRequestException('Преподаватели должны быть массивом строк');
    }

    if (names.length === 0) {
      throw new BadRequestException(
        'Необходимо указать хотя бы одно имя преподавателя',
      );
    }

    for (const name of names) {
      if (!name.trim()) {
        throw new BadRequestException('Имя преподавателя обязательно');
      }
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Проверяем существующих преподавателей в этом расписании
    const existingTeachers = await this.prisma.teacher.findMany({
      where: {
        name: { in: names },
        schedule_id: schedule.id,
      },
    });

    const existingNames = existingTeachers.map((t) => t.name);
    const uniqueNames = names.filter((name) => !existingNames.includes(name));

    if (uniqueNames.length === 0) {
      return this.getTeachers(apiKey, scheduleId);
    }

    // Создаем новых преподавателей
    await this.prisma.teacher.createMany({
      data: uniqueNames.map((name) => ({
        name,
        schedule_id: schedule.id,
      })),
      skipDuplicates: true,
    });

    return this.getTeachers(apiKey, scheduleId);
  }

  public async getTeachers(
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    const teachers = await this.prisma.teacher.findMany({
      where: {
        schedule_id: schedule.id,
      },
    });

    return teachers.map((t) => t.name);
  }

  public async getAllTeachers(
    apiKey: string,
  ): Promise<{ id: string; teachers: string[] }[]> {
    const { user } = await this.validateUserAndSchedule(apiKey);

    const schedules = await this.prisma.schedule.findMany({
      where: { user_id: user.id },
      select: { id: true },
    });

    const result = [];

    for (const s of schedules) {
      const teachers = await this.prisma.teacher.findMany({
        where: {
          schedule_id: s.id,
        },
      });
      result.push({ id: s.id, teachers: teachers.map((t) => t.name) });
    }

    return result;
  }

  public async changeTeacher(
    oldName: string,
    newName: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!oldName?.trim()) {
      throw new BadRequestException('Текущее имя преподавателя обязательно');
    }
    if (!newName?.trim()) {
      throw new BadRequestException('Новое имя преподавателя обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    // Находим преподавателя по имени и расписанию
    const teacherToUpdate = await this.prisma.teacher.findFirst({
      where: {
        name: oldName,
        schedule_id: schedule.id,
      },
    });

    if (!teacherToUpdate) {
      throw new NotFoundException(`Преподаватель "${oldName}" не найден`);
    }

    // Проверяем уникальность нового имени в этом расписании
    const nameExists = await this.prisma.teacher.findFirst({
      where: {
        name: newName,
        tid: { not: teacherToUpdate.tid },
        schedule_id: schedule.id,
      },
    });

    if (nameExists) {
      throw new ConflictException(`Преподаватель "${newName}" уже существует`);
    }

    // Обновляем имя преподавателя
    await this.prisma.teacher.update({
      where: { tid: teacherToUpdate.tid },
      data: { name: newName },
    });

    return this.getTeachers(apiKey, scheduleId);
  }

  public async deleteTeacher(
    name: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!name?.trim()) {
      throw new BadRequestException('Имя преподавателя обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    const teacherToDelete = await this.prisma.teacher.findFirst({
      where: {
        name,
        schedule_id: schedule.id,
      },
    });

    if (!teacherToDelete) {
      throw new NotFoundException(`Преподаватель "${name}" не найден`);
    }

    await this.prisma.teacher.delete({
      where: { tid: teacherToDelete.tid },
    });

    return this.getTeachers(apiKey, scheduleId);
  }
}
