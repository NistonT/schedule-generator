import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService, // Сервис для работы с базой данных через Prisma
    private userService: UserService, // Сервис для работы с пользователями
  ) {}

  // Метод для сохранения расписания в базе данных
  async generatedSchedulePrisma(api_key: string, data: any): Promise<any> {
    // Проверка наличия API ключа
    if (!api_key || api_key.trim() === '') {
      throw new Error('API key is required and must not be empty');
    }

    // Поиск пользователя по API ключу
    const user = await this.userService.getByApiKey(api_key);

    // Если пользователь не найден, выбрасываем ошибку
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Генерация расписания на основе переданных данных
    const schedule_json = await this.generateSchedule(data);

    // Обновление расписания в базе данных для конкретного пользователя
    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        schedule: schedule_json,
      },
    });
  }

  // Метод для получения расписания по API ключу пользователя
  async getBySchedule(api_key: string) {
    // Поиск пользователя по API ключу
    const user = await this.userService.getByApiKey(api_key);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Возвращаем расписание пользователя из базы данных
    return await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
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

    const timetable: Record<number, any[]> = {};

    // Инициализация расписания для каждого дня
    for (let dayIndex = 1; dayIndex <= days; dayIndex++) {
      timetable[dayIndex] = [];
    }

    // Перебор всех групп для составления расписания
    for (const group of groups) {
      // Создание очереди предметов для текущей группы
      const subjectQueue = this.createSubjectQueue(
        subjectsMap[group],
        amountLimits,
      );

      // Распределение предметов по дням
      let dayIndex = 1;
      for (const subjectInfo of subjectQueue) {
        while (subjectInfo.remaining > 0) {
          // Поиск преподавателя для текущего предмета
          const teacherInfo = this.findTeacherForSubject(
            subjectInfo.subject,
            teachersMap,
            teachers,
            group,
          );
          if (!teacherInfo) continue;

          // Поиск свободного кабинета для преподавателя
          const cabinet = this.findCabinetForTeacher(
            teacherInfo.tid,
            cabinetLimits,
            cabinets,
            timetable,
            dayIndex,
            timetable[dayIndex].length + 1,
            maxLoad,
          );
          if (!cabinet) continue;

          // Добавление занятия в расписание
          if (
            subjectInfo.lessonType === '1' ||
            subjectInfo.lessonType === '2'
          ) {
            this.addSubgroupLesson(
              timetable,
              dayIndex,
              subjectInfo,
              teacherInfo,
              cabinetLimits,
              cabinets,
              group,
              teachers,
              teachersMap,
              amountLimits,
              maxLoad,
            );
          } else if (subjectInfo.lessonType === 'L') {
            if (timetable[dayIndex].length < maxLoad) {
              timetable[dayIndex].push([
                {
                  cabinet,
                  teacher: teacherInfo.name,
                  subject: subjectInfo.subject,
                  group,
                  lessonType: subjectInfo.lessonType,
                },
              ]);
            }
          }

          // Уменьшение оставшегося количества занятий по предмету
          subjectInfo.remaining--;
          this.decrementAmountLimit(amountLimits, group, subjectInfo.subject);

          // Переход к следующему дню
          dayIndex = (dayIndex % days) + 1;
        }
      }
    }

    return { timetable };
  }

  // Метод для создания очереди предметов с учетом лимитов
  private createSubjectQueue(subjects: string[], amountLimits: any[]): any[] {
    const queue: any[] = [];
    for (const subject of subjects) {
      // Фильтрация лимитов для текущего предмета
      const limits = amountLimits.filter((l) => l.subject === subject);
      for (const limit of limits) {
        queue.push({
          subject,
          remaining: limit.amount || 0,
          lessonType: limit.lessonType || 'L',
        });
      }
    }
    // Возвращаем только те предметы, у которых остались занятия
    return queue.filter((item) => item.remaining > 0);
  }

  // Метод для поиска преподавателя по предмету и группе
  private findTeacherForSubject(
    subject: string,
    teachersMap: any[],
    teachers: any[],
    group: string,
  ): any | null {
    // Поиск маппинга преподавателя для предмета и группы
    const teacherMapping = teachersMap.find(
      (map) => map.subject === subject && map.group === group,
    );
    if (teacherMapping) {
      // Поиск преподавателя по его ID
      const teacher = teachers.find((t) => t.tid === teacherMapping.tid);
      return teacher || null;
    }
    return null;
  }

  // Метод для поиска свободного кабинета для преподавателя
  private findCabinetForTeacher(
    tid: number,
    cabinetLimits: any[],
    cabinets: string[],
    timetable: Record<number, any[]>,
    day: number,
    effectiveLoad: number,
    maxLoad: number,
    excludeCabinets: string[] = [],
  ): string | null {
    // Получение списка доступных кабинетов для преподавателя
    const allowedCabinets =
      cabinetLimits.find((limit) => limit.tid === tid)?.cabinets || [];
    for (const cabinet of allowedCabinets) {
      // Проверка, что кабинет не занят и не в списке исключений
      if (
        !excludeCabinets.includes(cabinet) &&
        !this.isCabinetBusy(timetable, day, effectiveLoad, cabinet)
      ) {
        return cabinet;
      }
    }
    return null;
  }

  // Метод для проверки, занят ли кабинет в определенное время
  private isCabinetBusy(
    timetable: Record<number, any[]>,
    day: number,
    effectiveLoad: number,
    cabinet: string,
  ): boolean {
    // Фильтрация занятий в кабинете на указанный день
    const lessons = timetable[day]?.filter((lesson) => {
      if (Array.isArray(lesson)) {
        return lesson.some((sublesson) => sublesson.cabinet === cabinet);
      }
      return lesson.cabinet === cabinet;
    });
    // Проверка, занят ли кабинет в указанное время
    return (
      lessons?.some((lesson) => this.getLessonHour(lesson) === effectiveLoad) ||
      false
    );
  }

  // Метод для получения часа занятия
  private getLessonHour(lesson: any): number {
    return Array.isArray(lesson) ? lesson[0].hour : lesson.hour;
  }

  // Метод для добавления занятия для подгруппы
  private addSubgroupLesson(
    timetable: Record<number, any[]>,
    dayIndex: number,
    subjectInfo: any,
    teacherInfo: any,
    cabinetLimits: any[],
    cabinets: string[],
    group: string,
    teachers: any[],
    teachersMap: any[],
    amountLimits: any[],
    maxLoad: number,
  ) {
    const subgroupLessons: any[] = [];

    // Проверка наличия лимита для первой подгруппы
    if (this.hasAmountLimit(amountLimits, group, subjectInfo.subject, '1')) {
      const teacher1 = this.findTeacherForSubject(
        subjectInfo.subject,
        teachersMap,
        teachers,
        group,
      );
      const cabinet1 = this.findUniqueCabinet(
        teacher1.tid,
        cabinetLimits,
        cabinets,
        timetable,
        dayIndex,
        timetable[dayIndex].length + 1,
        maxLoad,
      );
      if (teacher1 && cabinet1) {
        subgroupLessons.push({
          cabinet: cabinet1,
          teacher: teacher1.name,
          subject: subjectInfo.subject,
          group,
          lessonType: '1',
        });
      }
    }

    // Проверка наличия лимита для второй подгруппы
    if (this.hasAmountLimit(amountLimits, group, subjectInfo.subject, '2')) {
      const teacher2 = this.findAlternativeTeacherForSubject(
        subjectInfo.subject,
        subgroupLessons.length > 0 ? subgroupLessons[0].teacher : null,
        teachers,
        teachersMap,
        group,
      );
      const cabinet2 = this.findUniqueCabinet(
        teacher2?.tid || teacherInfo.tid,
        cabinetLimits,
        cabinets,
        timetable,
        dayIndex,
        timetable[dayIndex].length + 1,
        maxLoad,
        subgroupLessons.map((lesson) => lesson.cabinet),
      );
      if (teacher2 && cabinet2) {
        subgroupLessons.push({
          cabinet: cabinet2,
          teacher: teacher2.name,
          subject: subjectInfo.subject,
          group,
          lessonType: '2',
        });
      }
    }

    // Добавление занятий для подгрупп в расписание, если есть место
    if (subgroupLessons.length > 0 && timetable[dayIndex].length < maxLoad) {
      timetable[dayIndex].push(subgroupLessons);
    }
  }

  // Метод для поиска уникального кабинета с учетом исключений
  private findUniqueCabinet(
    tid: number,
    cabinetLimits: any[],
    cabinets: string[],
    timetable: Record<number, any[]>,
    day: number,
    effectiveLoad: number,
    maxLoad: number,
    excludeCabinets: string[] = [],
  ): string | null {
    const allowedCabinets =
      cabinetLimits.find((limit) => limit.tid === tid)?.cabinets || [];
    for (const cabinet of allowedCabinets) {
      if (
        !excludeCabinets.includes(cabinet) &&
        !this.isCabinetBusy(timetable, day, effectiveLoad, cabinet)
      ) {
        return cabinet;
      }
    }
    return null;
  }

  // Метод для поиска альтернативного преподавателя для предмета
  private findAlternativeTeacherForSubject(
    subject: string,
    currentTeacherName: string | null,
    teachers: any[],
    teachersMap: any[],
    group: string,
  ): any | null {
    // Фильтрация преподавателей, исключая текущего
    const alternativeTeachers = teachers.filter(
      (t) => t.name !== currentTeacherName,
    );
    for (const teacher of alternativeTeachers) {
      const teacherMapping = teachersMap.find(
        (map) =>
          map.subject === subject &&
          map.group === group &&
          map.tid === teacher.tid,
      );
      if (teacherMapping) {
        return teacher;
      }
    }
    return null;
  }

  // Метод для проверки наличия лимита занятий для группы и предмета
  private hasAmountLimit(
    amountLimits: any[],
    group: string,
    subject: string,
    lessonType: string,
  ): boolean {
    return !!amountLimits.find(
      (limit) =>
        limit.group === group &&
        limit.subject === subject &&
        limit.lessonType === lessonType,
    );
  }

  // Метод для уменьшения лимита занятий для группы и предмета
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
