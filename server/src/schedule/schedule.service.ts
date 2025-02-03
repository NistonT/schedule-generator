import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async generateSchedule(data: any): Promise<any> {
    const apiUrl = process.env.API_LLAMA; // URL API Ollama
    if (!apiUrl || !apiUrl.startsWith('http')) {
      throw new Error('Invalid API_LLAMA URL');
    }

    try {
      // Проверяем наличие параметра days
      if (!data.days || typeof data.days !== 'number' || data.days <= 0) {
        throw new Error('Invalid or missing days parameter');
      }

      // Формируем промпт для нейросети
      const prompt = this.formatPrompt(data);

      // Отправляем запрос без таймаута (timeout: 0)
      const response = await lastValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: 'llama3.1:8b', // Модель Ollama
            prompt: prompt,
            stream: false, // Отключаем стриминговый режим
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 0, // Устанавливаем бесконечный таймаут
          },
        ),
      );

      // Извлекаем JSON из строки response
      const jsonResponse = this.extractJsonFromResponse(response.data.response);

      // Валидация и корректировка расписания
      const correctedSchedule = this.correctSchedule(
        JSON.parse(jsonResponse),
        data,
      );

      return JSON.stringify(correctedSchedule); // Возвращаем исправленное расписание
    } catch (error) {
      console.error('Error during API request:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  private correctSchedule(schedule: any, data: any): any {
    const subjectHoursMap: {
      [key: number]: { lecture: number; lab1: number; lab2: number };
    } = {};

    // Создаем карту с ограничениями по часам для каждого предмета
    data.t_subjects_hours.forEach((hours) => {
      subjectHoursMap[hours.subject_id] = {
        lecture: hours.lecture_hours,
        lab1: hours.l1_hours,
        lab2: hours.l2_hours,
      };
    });

    // Считаем фактическое количество часов для каждого предмета
    const actualHoursMap: {
      [key: number]: { lecture: number; lab1: number; lab2: number };
    } = {};

    for (const day in schedule.timetable) {
      const lessons = schedule.timetable[day];
      for (let i = lessons.length - 1; i >= 0; i--) {
        const lesson = lessons[i];
        const subject = data.t_subjects.find(
          (subj) => subj.name === lesson.subject,
        );
        const hours = subjectHoursMap[subject.id];

        if (!actualHoursMap[subject.id]) {
          actualHoursMap[subject.id] = { lecture: 0, lab1: 0, lab2: 0 };
        }

        let type = '';
        if (hours.lecture > actualHoursMap[subject.id].lecture) {
          actualHoursMap[subject.id].lecture++;
          type = 'lecture';
        } else if (hours.lab1 > actualHoursMap[subject.id].lab1) {
          actualHoursMap[subject.id].lab1++;
          type = 'lab1';
        } else if (hours.lab2 > actualHoursMap[subject.id].lab2) {
          actualHoursMap[subject.id].lab2++;
          type = 'lab2';
        } else {
          // Если лимиты исчерпаны, удаляем занятие
          lessons.splice(i, 1);
        }
      }
    }

    return schedule;
  }

  private formatPrompt(data: any): string {
    let prompt = `Generate a timetable for ${data.days} days based on the following data:\n`;

    // Добавляем информацию о кабинетах
    if (data.t_cabinets && data.t_cabinets.length > 0) {
      prompt += `Cabinets:\n`;
      data.t_cabinets.forEach((cabinet) => {
        prompt += `ID: ${cabinet.id}, Name: ${cabinet.name}\n`;
      });
    }

    // Добавляем информацию о группах
    if (data.t_groups && data.t_groups.length > 0) {
      prompt += `\nGroups:\n`;
      data.t_groups.forEach((group) => {
        prompt += `ID: ${group.id}, Name: ${group.name}\n`;
      });
    }

    // Добавляем информацию о предметах и часах
    if (
      data.t_subjects &&
      data.t_subjects.length > 0 &&
      data.t_subjects_hours &&
      data.t_subjects_hours.length > 0
    ) {
      prompt += `\nSubjects and Hours:\n`;
      data.t_subjects.forEach((subject) => {
        const hours = data.t_subjects_hours.find(
          (h) => h.subject_id === subject.id,
        );
        if (hours) {
          prompt += `Subject: ${subject.name}, Group ID: ${subject.group_id}, Lecture Hours: ${hours.lecture_hours}, Lab1 Hours: ${hours.l1_hours}, Lab2 Hours: ${hours.l2_hours}\n`;
        }
      });
    }

    // Добавляем информацию о преподавателях
    if (data.t_teachers && data.t_teachers.length > 0) {
      prompt += `\nTeachers:\n`;
      data.t_teachers.forEach((teacher) => {
        prompt += `ID: ${teacher.id}, Name: ${teacher.name}, Preferred Cabinet ID: ${teacher.preferred_cabinet_id}\n`;
      });
    }

    // Добавляем информацию о связях между преподавателями и предметами
    if (data.t_teachers_link && data.t_teachers_link.length > 0) {
      prompt += `\nTeacher-Subject Links:\n`;
      data.t_teachers_link.forEach((link) => {
        prompt += `Teacher ID: ${link.teacher_id}, Subject ID: ${link.subject_id}\n`;
      });
    }

    // Добавляем формат выходных данных без строки "time"
    prompt += `\nPlease generate a timetable in the following JSON format with numeric day indices:\n`;
    prompt += `{\n`;
    prompt += `  "timetable": {\n`;
    prompt += `    "<date>": [\n`;
    prompt += `      {\n`;
    prompt += `        "cabinet": "<cabinet_name>",\n`;
    prompt += `        "teacher": "<teacher_name>",\n`;
    prompt += `        "subject": "<subject_name>",\n`;
    prompt += `        "group": "<group_name>"\n`;
    prompt += `      }\n`;
    prompt += `    ]\n`;
    prompt += `  }\n`;
    prompt += `}`;

    return prompt;
  }

  private extractJsonFromResponse(response: string): string {
    // Используем регулярное выражение для извлечения JSON из строки
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    } else {
      throw new Error('No JSON found in the response');
    }
  }

  private validateSchedule(schedule: any, data: any): boolean {
    const subjectHours = data.t_subjects_hours;

    for (const day in schedule.timetable) {
      const lessons = schedule.timetable[day];
      for (const lesson of lessons) {
        const subject = data.t_subjects.find(
          (subj) => subj.name === lesson.subject,
        );
        const hours = subjectHours.find((h) => h.subject_id === subject.id);

        if (hours) {
          if (hours.lecture_hours > 0) {
            hours.lecture_remains--;
          } else if (hours.l1_hours > 0) {
            hours.l1_remains--;
          } else if (hours.l2_hours > 0) {
            hours.l2_remains--;
          }

          if (
            hours.lecture_remains < 0 ||
            hours.l1_remains < 0 ||
            hours.l2_remains < 0
          ) {
            throw new Error(`Too many hours for subject ${lesson.subject}`);
          }
        }
      }
    }

    return true;
  }
}
