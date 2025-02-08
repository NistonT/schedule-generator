import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  constructor(private httpService: HttpService) {}

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
      hours,
    } = data;

    const timetable: Record<number, any[]> = {};

    for (const group of groups) {
      let totalHours = hours[group].reduce((sum, h) => sum + h, 0);
      const dailyLoad = Math.floor(totalHours / days);
      let remainingHours = totalHours % days;

      const subjectQueue = this.createSubjectQueue(
        subjectsMap[group],
        amountLimits,
      );

      // Распределение пар для каждого предмета
      for (const subjectInfo of subjectQueue) {
        const subjectHours = subjectInfo.remaining;
        const dailySubjectLoad = Math.floor(subjectHours / days);
        let remainingSubjectHours = subjectHours % days;

        for (let dayIndex = 1; dayIndex <= days; dayIndex++) {
          if (!timetable[dayIndex]) {
            timetable[dayIndex] = [];
          }

          const loadForDay =
            dailySubjectLoad + (remainingSubjectHours > 0 ? 1 : 0);
          remainingSubjectHours--;

          for (let i = 0; i < loadForDay && subjectInfo.remaining > 0; i++) {
            if (timetable[dayIndex].length >= maxLoad) break;

            const teacherInfo = this.findTeacherForSubject(
              subjectInfo.subject,
              teachersMap,
              teachers,
            );
            if (!teacherInfo) continue;

            const cabinet = this.findCabinetForTeacher(
              teacherInfo.tid,
              cabinetLimits,
              cabinets,
              timetable,
              dayIndex,
              timetable[dayIndex].length + 1,
            );
            if (!cabinet) continue;

            timetable[dayIndex].push({
              cabinet,
              teacher: teacherInfo.name,
              subject: subjectInfo.subject,
              group,
            });

            subjectInfo.remaining--;
            this.decrementAmountLimit(amountLimits, group, subjectInfo.subject);
          }
        }
      }
    }

    return { timetable };
  }

  private createSubjectQueue(subjects: string[], amountLimits: any[]): any[] {
    return subjects
      .map((subject) => {
        const limit = amountLimits.find((l) => l.subject === subject);
        return { subject, remaining: limit?.amount || 0 };
      })
      .filter((item) => item.remaining > 0);
  }

  private findTeacherForSubject(
    subject: string,
    teachersMap: any[],
    teachers: any[],
  ): any | null {
    const teacherMapping = teachersMap.find((map) => map.subject === subject);
    if (!teacherMapping) return null;
    const teacher = teachers.find((t) => t.tid === teacherMapping.tid);
    return teacher || null;
  }

  private findCabinetForTeacher(
    tid: number,
    cabinetLimits: any[],
    cabinets: string[],
    timetable: Record<number, any[]>,
    day: number,
    hour: number,
  ): string | null {
    const allowedCabinets =
      cabinetLimits.find((limit) => limit.tid === tid)?.cabinets || [];
    for (const cabinet of allowedCabinets) {
      if (!this.isCabinetBusy(timetable, day, hour, cabinet)) {
        return cabinet;
      }
    }
    return null;
  }

  private isCabinetBusy(
    timetable: Record<number, any[]>,
    day: number,
    hour: number,
    cabinet: string,
  ): boolean {
    const lessons = timetable[day]?.filter(
      (lesson) => lesson.cabinet === cabinet,
    );
    return lessons?.some((lesson) => lesson.hour === hour) || false;
  }

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
