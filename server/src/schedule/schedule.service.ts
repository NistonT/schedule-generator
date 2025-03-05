import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Метод для сохранения расписания в базе данных
  async generatedSchedulePrisma(api_key: string, data: any): Promise<any> {
    if (!api_key || api_key.trim() === '') {
      throw new Error('API key is required and must not be empty');
    }

    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const schedule_json = await this.generateSchedule(data);

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
    const user = await this.userService.getByApiKey(api_key);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

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

    const groupTimetables: Record<string, Record<string, any[]>> = {};

    // Создаем пустое расписание для каждой группы
    for (const group of groups) {
      groupTimetables[group] = {};
      for (const day of days) {
        groupTimetables[group][day] = [];
      }
    }

    // Создаем карту доступности преподавателей и кабинетов
    const teacherAvailability: Record<string, boolean[]> = {};
    const cabinetAvailability: Record<string, boolean[]> = {};

    for (const day of days) {
      teacherAvailability[day] = Array(maxLoad).fill(true);
      cabinetAvailability[day] = Array(maxLoad).fill(true);
    }

    // Перебор всех групп
    for (const group of groups) {
      const subjectQueue = this.createSubjectQueue(
        subjectsMap[group],
        amountLimits.filter((limit) => limit.group === group),
      );

      let dayIndex = 0;
      for (const subjectInfo of subjectQueue) {
        while (subjectInfo.remaining > 0) {
          const currentDay = days[dayIndex % days.length];

          // Проверяем доступность преподавателя
          const teacherInfo = this.findAvailableTeacherForSubject(
            subjectInfo.subject,
            teachersMap,
            teachers,
            group,
            teacherAvailability[currentDay],
          );
          if (!teacherInfo) continue;

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
          if (!cabinet) continue;

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
        }
      }
    }

    return { groupTimetables };
  }

  // Метод для создания очереди предметов с учетом лимитов
  private createSubjectQueue(subjects: string[], amountLimits: any[]): any[] {
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
    const allowedCabinets =
      cabinetLimits.find((limit) => limit.tid === tid)?.cabinets || [];
    for (const cabinet of allowedCabinets) {
      if (
        availability[effectiveLoad - 1] &&
        !this.isCabinetBusy(timetable, day, effectiveLoad, cabinet)
      ) {
        return cabinet;
      }
    }
    return null;
  }

  // Метод для проверки занятости кабинета
  private isCabinetBusy(
    timetable: Record<string, any[]>,
    day: string,
    effectiveLoad: number,
    cabinet: string,
  ): boolean {
    const lessons = timetable[day]?.filter((lesson) => {
      if (Array.isArray(lesson)) {
        return lesson.some((sublesson) => sublesson.cabinet === cabinet);
      }
      return lesson.cabinet === cabinet;
    });
    return (
      lessons?.some((lesson) => this.getLessonHour(lesson) === effectiveLoad) ||
      false
    );
  }

  // Метод для получения часа занятия
  private getLessonHour(lesson: any): number {
    return Array.isArray(lesson) ? lesson[0].hour : lesson.hour;
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
    cabinetAvailability[cabinet] = false;
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
