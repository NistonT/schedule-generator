import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Создание расписания
  public async addGeneratedSchedulePrisma(
    api_key: string,
    data: any,
  ): Promise<any> {
    if (!api_key || api_key.trim() === '') {
      throw new Error('API key is required and must not be empty');
    }

    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const schedule_json = await this.generateSchedule(data);

    return await this.prisma.schedule.create({
      data: {
        schedule: schedule_json,
        scheduleMain: { create: [] },
        failed: { create: [] },
        user_id: user.id,
        cabinets: [],
        groups: [],
        teachers: { create: [] },
        amountLimits: { create: [] },
        limitCabinets: { create: [] },
        isShow: true,
      },
    });
  }

  // Метод для сохранения/обновления расписания в базе данных
  async generatedSchedulePrisma(
    api_key: string,
    scheduleId: string,
    data: any,
  ): Promise<any> {
    // Проверка API ключа
    if (!api_key || api_key.trim() === '') {
      throw new BadRequestException(
        'API key is required and must not be empty',
      );
    }

    // Поиск пользователя
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Генерация расписания
    const schedule_json = await this.generateSchedule(data);

    // Обновление конкретного расписания
    return await this.prisma.schedule.update({
      where: {
        id: scheduleId,
        user_id: user.id, // Дополнительная проверка, что расписание принадлежит пользователю
      },
      data: {
        schedule: schedule_json,
      },
    });
  }

  // Метод для получения конкретного расписания по ID расписания и API ключу пользователя
  async getScheduleById(api_key: string, scheduleId: string) {
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return await this.prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        user_id: user.id, // Проверяем, что расписание принадлежит пользователю
      },
      select: {
        id: true,

        title: true,
        description: true,
        isShow: true,

        schedule: true,
        scheduleMain: true,
        failed: true,

        schedule_count: true,

        cabinets: true,
        teachers: true,
        groups: true,

        mapSubjects: true,
        mapTeachers: true,
        amountLimits: true,
        limitCabinets: true,

        CreatedAt: true,
        UpdatedAt: true,
      },
    });
  }

  // Метод для получения всех расписаний пользователя
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
        scheduleMain: true,
        failed: true,

        schedule_count: true,

        cabinets: true,
        teachers: true,
        groups: true,

        mapSubjects: true,
        mapTeachers: true,
        amountLimits: true,
        limitCabinets: true,

        CreatedAt: true,
        UpdatedAt: true,
      },
      orderBy: {
        CreatedAt: 'desc', // Сортировка по дате создания (новые сначала)
      },
    });
  }

  // Метод для генерации расписания
  async generateSchedule(data: any): Promise<any> {
    const {
      cabinets,
      groups,
      teachers,
      subjectsMap,
      teachersMap,
      amountLimits,
      cabinetLimits,
      days,
      maxLoad,
    } = data;

    if (!Array.isArray(amountLimits) || amountLimits.length === 0) {
      throw new Error('Необходимо указать лимиты на количество занятий');
    }

    if (!Array.isArray(teachersMap) || teachersMap.length === 0) {
      throw new Error(
        'Необходимо указать соответствие преподавателей и предметов',
      );
    }

    const groupTimetables: Record<string, Record<string, any[]>> = {};
    const failedAllocations: {
      group: string;
      subject: string;
      reason: string;
    }[] = [];

    // Создаем пустое расписание для каждой группы
    for (const group of groups) {
      groupTimetables[group] = {};
      for (const day of days) {
        groupTimetables[group][day] = [];
      }

      // Проверяем, есть ли предметы для группы
      const subjects = subjectsMap[group] || [];
      if (!Array.isArray(subjects)) {
        throw new Error(`Invalid subjects data for group ${group}`);
      }

      // Создаем очередь предметов
      const subjectQueue = this.createSubjectQueue(
        subjects,
        amountLimits.filter((limit) => limit.group === group),
      );

      // Инициализация карты доступности преподавателей и кабинетов
      const teacherAvailability: Record<string, boolean[]> = {};
      const cabinetAvailability: Record<string, boolean[]> = {};

      for (const day of days) {
        teacherAvailability[day] = Array(maxLoad).fill(true);
        cabinetAvailability[day] = Array(maxLoad).fill(true);
      }

      let dayIndex = 0;
      for (const subjectInfo of subjectQueue) {
        let attempts = 0;
        const maxAttempts = 1000; // Ограничение на количество попыток

        while (subjectInfo.remaining > 0) {
          if (attempts >= maxAttempts) {
            // Логируем проблему, но продолжаем генерацию
            failedAllocations.push({
              group,
              subject: subjectInfo.subject,
              reason: `Не удалось распределить занятие после ${maxAttempts} попыток`,
            });
            console.warn(
              `Пропущено занятие: ${subjectInfo.subject} для группы ${group}`,
            );
            break;
          }

          const currentDay = days[dayIndex % days.length];

          // Проверяем доступность преподавателя
          const teacherInfo = this.findAvailableTeacherForSubject(
            subjectInfo.subject,
            teachersMap,
            teachers,
            group,
            teacherAvailability[currentDay],
          );
          if (!teacherInfo) {
            dayIndex = (dayIndex + 1) % days.length;
            attempts++;
            continue;
          }

          // Проверяем доступность кабинета
          const cabinet = this.findAvailableCabinetForTeacher(
            teacherInfo.tid,
            cabinetLimits,
            cabinets,
            cabinetAvailability[currentDay],
            groupTimetables[group],
            currentDay,
            groupTimetables[group][currentDay].length + 1,
            maxLoad,
          );
          if (!cabinet) {
            console.warn(
              `Нет доступных кабинетов для преподавателя ${teacherInfo.name} (tid: ${teacherInfo.tid}) в день ${currentDay}`,
            );
            dayIndex = (dayIndex + 1) % days.length;
            attempts++;
            continue;
          }

          // Добавляем занятие в расписание группы
          if (groupTimetables[group][currentDay].length < maxLoad) {
            groupTimetables[group][currentDay].push([
              {
                cabinet,
                teacher: teacherInfo.name,
                subject: subjectInfo.subject,
                group,
                lessonType: subjectInfo.lessonType,
              },
            ]);
            this.markTeacherAndCabinetAsBusy(
              teacherInfo.tid,
              cabinet,
              teacherAvailability[currentDay],
              cabinetAvailability[currentDay],
              groupTimetables[group][currentDay].length - 1,
            );
          }

          subjectInfo.remaining--;
          this.decrementAmountLimit(amountLimits, group, subjectInfo.subject);

          dayIndex = (dayIndex + 1) % days.length;
          attempts = 0; // Сбрасываем счетчик попыток при успешном распределении
        }
      }
    }

    let globalId = 1; // Счетчик глобальных ID

    const flatSchedule = Object.entries(groupTimetables).flatMap(
      ([group, timetable]) =>
        Object.entries(timetable).flatMap(([date, lessonsPerDay]) =>
          lessonsPerDay.map((lessonBlock, index) => {
            const lessons = Array.isArray(lessonBlock)
              ? lessonBlock
              : [lessonBlock];

            return lessons.map((lesson) => ({
              id: globalId++,
              group,
              date,
              cabinet: lesson.cabinet,
              subject: lesson.subject,
              teacher: lesson.teacher,
              lessonType: lesson.lessonType,
              lesson: index + 1,
            }));
          }),
        ),
    );

    return {
      schedule: flatSchedule,
      failedAllocations,
    };
  }

  // Метод для создания очереди предметов с учетом лимитов
  private createSubjectQueue(subjects: string[], amountLimits: any[]): any[] {
    if (!Array.isArray(subjects)) {
      throw new Error('Subjects must be an array');
    }

    const queue: any[] = [];
    for (const subject of subjects) {
      const limits = amountLimits.filter((l) => l.subject === subject);
      for (const limit of limits) {
        queue.push({
          subject,
          remaining: limit.amount || 0,
          lessonType: limit.lessonType || 'L',
        });
      }
    }
    return queue.filter((item) => item.remaining > 0);
  }

  // Метод для поиска доступного преподавателя
  private findAvailableTeacherForSubject(
    subject: string,
    teachersMap: any[],
    teachers: any[],
    group: string,
    availability: boolean[],
  ): any | null {
    const teacherMapping = teachersMap.find(
      (map) => map.subject === subject && map.group === group,
    );
    if (teacherMapping) {
      const teacher = teachers.find((t) => t.tid === teacherMapping.tid);
      if (teacher && availability.some((val) => val)) {
        return teacher;
      }
    }
    return null;
  }

  // Метод для поиска доступного кабинета
  private findAvailableCabinetForTeacher(
    tid: number,
    cabinetLimits: any[],
    cabinets: string[],
    availability: boolean[],
    timetable: Record<string, any[]>,
    day: string,
    effectiveLoad: number,
    maxLoad: number,
  ): string | null {
    // Получаем разрешенные кабинеты для преподавателя
    const allowedCabinets =
      cabinetLimits.find((limit) => limit.tid === tid)?.cabinets || [];

    // Если для преподавателя не указаны кабинеты, используем общий список кабинетов
    const candidateCabinets =
      allowedCabinets.length > 0 ? allowedCabinets : cabinets;

    // Проверяем каждый кандидатский кабинет на доступность
    for (const cabinet of candidateCabinets) {
      if (
        availability[effectiveLoad - 1] &&
        !this.isCabinetBusy(timetable, day, effectiveLoad, cabinet)
      ) {
        return cabinet; // Возвращаем первый доступный кабинет
      }
    }

    return null; // Если ни один кабинет не доступен, возвращаем null
  }

  // Метод для проверки занятости кабинета
  private isCabinetBusy(
    timetable: Record<string, any[]>,
    day: string,
    effectiveLoad: number,
    cabinet: string,
  ): boolean {
    const lessons = timetable[day] || [];
    return lessons.some((lesson) => {
      if (Array.isArray(lesson)) {
        return lesson.some(
          (sublesson) =>
            sublesson.cabinet === cabinet && sublesson.hour === effectiveLoad,
        );
      }
      return lesson.cabinet === cabinet && lesson.hour === effectiveLoad;
    });
  }

  // Метод для отметки преподавателя и кабинета как занятых
  private markTeacherAndCabinetAsBusy(
    tid: number,
    cabinet: string,
    teacherAvailability: boolean[],
    cabinetAvailability: boolean[],
    hour: number,
  ) {
    teacherAvailability[hour] = false;
    cabinetAvailability[hour] = false;
  }

  // Метод для уменьшения лимита
  private decrementAmountLimit(
    amountLimits: any[],
    group: string,
    subject: string,
  ) {
    const limit = amountLimits.find(
      (l) => l.group === group && l.subject === subject,
    );
    if (limit && limit.amount > 0) {
      limit.amount--;
    } else {
      console.warn(
        `Лимит для группы ${group} и предмета ${subject} уже достиг нуля.`,
      );
    }
  }
}
