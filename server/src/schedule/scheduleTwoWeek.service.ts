import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ScheduleDefaultService } from './schedule.default.service';

@Injectable()
export class ScheduleTwoWeekService {
  constructor(
    private prisma: PrismaService,
    private scheduleService: ScheduleDefaultService,
  ) {}

  public async create() {}

  public async updated() {}

  public async delete() {}

  async generateMainTwoWeekSchedule(
    data: any,
    upperStartDate: string,
  ): Promise<any> {
    const lowerStartDate = this.addDaysToDate(upperStartDate, 7);

    const upperData = JSON.parse(JSON.stringify(data));
    const lowerData = JSON.parse(JSON.stringify(data));

    const upperResult = await this.generateOneWeekSchedule(
      upperData,
      'upper',
      upperStartDate,
    );
    lowerData.amountLimits = this.deepCopy(upperResult.remainingAmountLimits);
    const lowerResult = await this.generateOneWeekSchedule(
      lowerData,
      'lower',
      lowerStartDate,
    );

    const mainSchedule = this.interleaveSchedulesWithWeekType(
      upperResult.schedule,
      lowerResult.schedule,
    );

    return {
      schedule: data.originalSchedule ?? upperResult.schedule,
      failedAllocations: [
        ...upperResult.failedAllocations,
        ...lowerResult.failedAllocations,
      ],
      mainSchedule,
    };
  }

  // Генерация одной недели по начальной дате
  private async generateOneWeekSchedule(
    data: any,
    weekType: 'upper' | 'lower',
    startDateStr: string,
  ): Promise<{
    schedule: any[];
    remainingAmountLimits: any[];
    failedAllocations: any[];
  }> {
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

    if (!Array.isArray(amountLimits)) throw new Error('Invalid amountLimits');
    if (!Array.isArray(teachersMap)) throw new Error('Invalid teachersMap');

    const dateMapping = this.generateDates(startDateStr, days);

    const groupTimetables: Record<string, Record<string, any[]>> = {};
    const failedAllocations: {
      group: string;
      subject: string;
      reason: string;
    }[] = [];

    for (const group of groups) {
      groupTimetables[group] = {};
      for (const day of days) {
        groupTimetables[group][day] = [];
      }

      const subjects = subjectsMap[group] || [];
      if (!Array.isArray(subjects)) {
        throw new Error(`Invalid subjects data for group ${group}`);
      }

      const subjectQueue = this.createSubjectQueue(
        subjects,
        amountLimits.filter((limit) => limit.group === group),
      );

      const teacherAvailability: Record<string, boolean[]> = {};
      const cabinetAvailability: Record<string, boolean[]> = {};

      for (const day of days) {
        teacherAvailability[day] = Array(maxLoad).fill(true);
        cabinetAvailability[day] = Array(maxLoad).fill(true);
      }

      let dayIndex = 0;
      for (const subjectInfo of subjectQueue) {
        let attempts = 0;
        const maxAttempts = 1000;

        while (subjectInfo.remaining > 0) {
          if (attempts >= maxAttempts) {
            failedAllocations.push({
              group,
              subject: subjectInfo.subject,
              reason: `Не удалось распределить занятие после ${maxAttempts} попыток`,
            });
            break;
          }

          const currentDay = days[dayIndex % days.length];

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
          attempts = 0;
        }
      }
    }

    const flatSchedule = Object.entries(groupTimetables).flatMap(
      ([group, timetable]) =>
        Object.entries(timetable).flatMap(([dayName, lessonsPerDay]) =>
          lessonsPerDay.map((lessonBlock, index) => {
            const lessons = Array.isArray(lessonBlock)
              ? lessonBlock
              : [lessonBlock];
            return lessons.map((lesson) => ({
              group,
              date: dateMapping[dayName],
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
      remainingAmountLimits: amountLimits,
      failedAllocations,
    };
  }

  // Метод для создания очереди предметов с учетом лимитов
  private createSubjectQueue(subjects: string[], amountLimits: any[]): any[] {
    if (!Array.isArray(subjects)) throw new Error('Subjects must be an array');

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

  // Поиск преподавателя
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

  // Поиск кабинета
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

    const candidateCabinets =
      allowedCabinets.length > 0 ? allowedCabinets : cabinets;

    for (const cabinet of candidateCabinets) {
      if (
        availability[effectiveLoad - 1] &&
        !this.isCabinetBusy(timetable, day, effectiveLoad, cabinet)
      ) {
        return cabinet;
      }
    }

    return null;
  }

  // Проверка занятости кабинета
  private isCabinetBusy(
    timetable: Record<string, any[]>,
    day: string,
    effectiveLoad: number,
    cabinet: string,
  ): boolean {
    const lessons = timetable[day] || [];
    return lessons.some((lesson) => {
      return Array.isArray(lesson)
        ? lesson.some(
            (sublesson) =>
              sublesson.cabinet === cabinet && sublesson.hour === effectiveLoad,
          )
        : lesson.cabinet === cabinet && lesson.hour === effectiveLoad;
    });
  }

  // Отмечаем занятость
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

  // Уменьшение лимита
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

  // Чередование занятий из двух недель
  private interleaveSchedulesWithWeekType(upper: any[], lower: any[]): any[] {
    const result = [];
    const maxLength = Math.max(upper.length, lower.length);

    for (let i = 0; i < maxLength; i++) {
      if (upper[i]) result.push({ ...upper[i], weekType: 'upper' });
      if (lower[i]) result.push({ ...lower[i], weekType: 'lower' });
    }

    return result;
  }

  // Генерация дат по дням недели
  private generateDates(
    startDateStr: string,
    days: string[],
  ): Record<string, string> {
    const dayMap: Record<string, number> = {
      Пн: 1,
      Вт: 2,
      Ср: 3,
      Чт: 4,
      Пт: 5,
      Сб: 6,
      Вс: 0,
    };

    const startDate = new Date(startDateStr);
    const result: Record<string, string> = {};

    for (const dayName of days) {
      let targetDate = new Date(startDate);
      let currentDay = targetDate.getDay();

      let addDays = (dayMap[dayName] - currentDay + 7) % 7;
      if (addDays === 0 && days.indexOf(dayName) !== 0) addDays += 7;

      targetDate.setDate(targetDate.getDate() + addDays);

      result[dayName] = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    return result;
  }

  // Добавление дней к дате
  private addDaysToDate(dateStr: string, daysToAdd: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  }

  // Глубокое копирование объекта
  private deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
