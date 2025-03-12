import { BadRequestException, Injectable } from '@nestjs/common';
import { Schedule, Teacher } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ITeachers } from './dto/teacher.types';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async add(name: string, apiKey: string): Promise<Schedule> {
    if (!name) {
      throw new BadRequestException('Вы не ввели имя преподавателя');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
      include: {
        teachers: true,
      },
    });
    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const isTeacherExists = schedule.teachers.some(
      (teacher) => teacher.name === name,
    );
    if (isTeacherExists) {
      throw new BadRequestException('Этот преподаватель уже создан');
    }

    const teacher = await this.prisma.teacher.create({
      data: {
        name: name,
        schedule: {
          connect: {
            id: schedule.id,
          },
        },
      },
    });

    if (!teacher) {
      throw new BadRequestException('Преподаватель не создан');
    }

    return await this.prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        teachers: {
          connect: {
            tid: teacher.tid,
          },
        },
      },
      include: {
        teachers: true,
      },
    });
  }

  async get(apiKey: string): Promise<ITeachers[]> {
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
        teachers: true,
      },
    });
  }

  async change(
    oldName: string,
    newName: string,
    apiKey: string,
  ): Promise<Teacher> {
    if (!oldName) {
      throw new BadRequestException('Вы не ввели название преподавателя');
    }

    if (!newName) {
      throw new BadRequestException('Вы не ввели новое имя преподавателя');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
      include: {
        teachers: true,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const teacher = schedule.teachers.find(
      (teacher) => teacher.name === oldName,
    );

    if (!teacher) {
      throw new BadRequestException('Преподаватель не найден');
    }

    const filterTeacher = schedule.teachers.filter(
      (tid) => tid.name === newName,
    );

    if (filterTeacher.length > 0) {
      throw new BadRequestException('Имя преподавателя уже существует');
    }

    return await this.prisma.teacher.update({
      where: {
        tid: teacher.tid,
      },
      data: {
        name: newName,
      },
      include: {
        schedule: true,
      },
    });
  }

  async delete(name: string, apiKey: string): Promise<Teacher> {
    if (!name) {
      throw new BadRequestException('Вы не ввели имя преподавателя');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
      include: {
        teachers: true,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const teacher = schedule.teachers.find((teacher) => teacher.name === name);

    if (!teacher) {
      throw new BadRequestException('Преподаватель не найден');
    }

    return await this.prisma.teacher.delete({
      where: {
        tid: teacher.tid,
      },
      include: {
        schedule: true,
      },
    });
  }
}
