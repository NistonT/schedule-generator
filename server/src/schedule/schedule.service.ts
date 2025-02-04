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
      if (!data.days || typeof data.days !== 'number' || data.days <= 0) {
        throw new Error('Invalid or missing days parameter');
      }

      const prompt = this.formatPrompt(data);

      const response = await lastValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: 'llama3.1:8b',
            prompt: prompt,
            stream: false,
            format: 'json',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 0,
          },
        ),
      );

      const jsonResponse = this.extractJsonFromResponse(response.data);
      const correctedSchedule = this.correctSchedule(jsonResponse, data);

      return correctedSchedule.response;
    } catch (error) {
      console.error('Error during API request:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  private correctSchedule(schedule: any, data: any): any {
    const correctedSchedule: any = { timetable: {} };
    const teacherMap: { [key: string]: string } = {};

    // Создаем мап преподавателей без ID
    data.teachers.forEach((teacher) => {
      teacherMap[teacher.tid] = teacher.name;
    });

    // Список всех занятий для каждой группы
    const lessonsByGroup: { [key: string]: any[] } = {};
    data.amountLimits.forEach((limit) => {
      if (!lessonsByGroup[limit.group]) {
        lessonsByGroup[limit.group] = [];
      }
      if (limit.amount > 0) {
        lessonsByGroup[limit.group].push({
          subject: limit.subject,
          amount: limit.amount,
          lessonType: limit.lessonType,
        });
      }
    });

    // Расчет общего количества пар и их равномерного распределения по дням
    let totalRemainingLessons = Object.values(lessonsByGroup)
      .flat()
      .reduce((sum, lesson) => sum + lesson.amount, 0);

    const lessonsPerDay = Math.ceil(totalRemainingLessons / data.days); // Количество пар на день

    for (let day = 1; day <= data.days; day++) {
      correctedSchedule.timetable[day] = [];
      let totalLoad = 0;

      // Определяем максимальное количество пар для текущего дня
      const maxLessonsForDay = Math.min(data.maxLoad, lessonsPerDay);

      // Группируем пары по типам (группа + предмет + преподаватель)
      const groupedLessons: any[] = [];
      for (const group in lessonsByGroup) {
        for (const lesson of lessonsByGroup[group]) {
          if (lesson.amount > 0) {
            groupedLessons.push({
              group,
              subject: lesson.subject,
              teacher: lesson,
              amount: lesson.amount,
            });
          }
        }
      }

      // Сортируем пары по количеству оставшихся занятий (от больших к меньшим)
      groupedLessons.sort((a, b) => b.amount - a.amount);

      // Добавляем пары в расписание
      for (const lessonEntry of groupedLessons) {
        const { group, subject, teacher, amount } = lessonEntry;

        while (totalLoad < maxLessonsForDay && teacher.amount > 0) {
          const cabinet =
            data.cabinets[Math.floor(Math.random() * data.cabinets.length)];
          const teacherName =
            teacherMap[
              data.teachersMap.find(
                (t) => t.group === group && t.subject === subject,
              )?.tid
            ];

          correctedSchedule.timetable[day].push({
            cabinet: cabinet,
            teacher: teacherName,
            subject: subject,
            group: group,
          });

          totalLoad++;
          teacher.amount--;
          totalRemainingLessons--;

          if (totalLoad >= maxLessonsForDay || teacher.amount <= 0) break;
        }

        if (totalLoad >= maxLessonsForDay) break;
      }
    }

    return { response: correctedSchedule };
  }

  private formatPrompt(data: any): string {
    let prompt = `Создайте расписание на ${data.days} дней на основе следующих данных:\n`;

    if (data.cabinets && data.cabinets.length > 0) {
      prompt += `Кабинеты:\n`;
      data.cabinets.forEach((cabinet) => {
        prompt += `- ${cabinet}\n`;
      });
    }

    if (data.groups && data.groups.length > 0) {
      prompt += `\nГруппы:\n`;
      data.groups.forEach((group) => {
        prompt += `- ${group}\n`;
      });
    }

    if (data.teachers && data.teachers.length > 0) {
      prompt += `\nПреподаватели:\n`;
      data.teachers.forEach((teacher) => {
        prompt += `- ${teacher.name}\n`;
      });
    }

    if (data.subjectsMap && Object.keys(data.subjectsMap).length > 0) {
      prompt += `\nПредметы:\n`;
      for (const group in data.subjectsMap) {
        prompt += `Группа ${group}:\n`;
        data.subjectsMap[group].forEach((subject) => {
          prompt += `- ${subject}\n`;
        });
      }
    }

    if (data.amountLimits && data.amountLimits.length > 0) {
      prompt += `\nКоличество часов и типы занятий:\n`;
      data.amountLimits.forEach((limit) => {
        prompt += `- Группа ${limit.group}, предмет ${limit.subject}, количество часов: ${limit.amount}, тип занятия: ${limit.lessonType}\n`;
      });
    }

    if (data.cabinetLimits && data.cabinetLimits.length > 0) {
      prompt += `\nОграничения по кабинетам для преподавателей:\n`;
      data.cabinetLimits.forEach((limit) => {
        prompt += `- Преподаватель может использовать кабинеты: ${limit.cabinets.join(', ')}\n`;
      });
    }

    prompt += `\nМаксимальная нагрузка в день: ${data.maxLoad} пар\n`;

    if (data.hours && Object.keys(data.hours).length > 0) {
      prompt += `\nЧасы для групп:\n`;
      for (const group in data.hours) {
        prompt += `- Группа ${group}: ${data.hours[group][0]} часов в первой подгруппе, ${data.hours[group][1]} часов во второй подгруппе\n`;
      }
    }

    // Добавляем четкие инструкции для модели
    prompt += `\nВажные ограничения:\n`;
    prompt += `- Для каждой группы не должно быть больше пар, чем указано в "amountLimits".\n`;
    prompt += `- Общее количество пар в день не должно превышать "maxLoad", но желательно чтобы было 6 пар в одинь день.\n`;
    prompt += `- Если для группы нет доступных пар (amount = 0), не планируйте занятия для этой группы.\n`;

    prompt += `\nСгенерируйте расписание в следующем JSON-формате:\n`;
    prompt += `{\n`;
    prompt += `  "timetable": {\n`;
    prompt += `    "<день>": [\n`;
    prompt += `      {\n`;
    prompt += `        "cabinet": "<кабинет>",\n`;
    prompt += `        "teacher": "<преподаватель>",\n`;
    prompt += `        "subject": "<предмет>",\n`;
    prompt += `        "group": "<группа>"\n`;
    prompt += `      }\n`;
    prompt += `    ]\n`;
    prompt += `  }\n`;
    prompt += `}`;

    return prompt;
  }

  private extractJsonFromResponse(response: any): any {
    if (typeof response === 'object') {
      return response;
    } else {
      throw new Error('Invalid JSON response');
    }
  }
}
