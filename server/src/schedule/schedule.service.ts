import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
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

    for (const group of groups) {
      const subjectQueue = this.createSubjectQueue(
        subjectsMap[group],
        amountLimits,
      );

      for (let dayIndex = 1; dayIndex <= days; dayIndex++) {
        if (!timetable[dayIndex]) {
          timetable[dayIndex] = [];
        }

        // Попытаться заполнить все слоты до maxLoad
        while (timetable[dayIndex].length < maxLoad) {
          let subjectAssigned = false;

          for (const subjectInfo of subjectQueue) {
            if (subjectInfo.remaining <= 0) continue;

            const teacherInfo = this.findTeacherForSubject(
              subjectInfo.subject,
              teachersMap,
              teachers,
              group,
            );
            if (!teacherInfo) continue;

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

            subjectInfo.remaining--;
            this.decrementAmountLimit(amountLimits, group, subjectInfo.subject);
            subjectAssigned = true;

            if (timetable[dayIndex].length >= maxLoad) break;
          }

          // Если не удалось назначить ни одного занятия, выходим из цикла
          if (!subjectAssigned) break;
        }
      }
    }

    return { timetable };
  }

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

  private findTeacherForSubject(
    subject: string,
    teachersMap: any[],
    teachers: any[],
    group: string,
  ): any | null {
    const teacherMapping = teachersMap.find(
      (map) => map.subject === subject && map.group === group,
    );
    if (teacherMapping) {
      const teacher = teachers.find((t) => t.tid === teacherMapping.tid);
      return teacher || null;
    }
    return null;
  }

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

  private isCabinetBusy(
    timetable: Record<number, any[]>,
    day: number,
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

  private getLessonHour(lesson: any): number {
    return Array.isArray(lesson) ? lesson[0].hour : lesson.hour;
  }

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

    if (subgroupLessons.length > 0 && timetable[dayIndex].length < maxLoad) {
      timetable[dayIndex].push(subgroupLessons);
    }
  }

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

  private findAlternativeTeacherForSubject(
    subject: string,
    currentTeacherName: string | null,
    teachers: any[],
    teachersMap: any[],
    group: string,
  ): any | null {
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
