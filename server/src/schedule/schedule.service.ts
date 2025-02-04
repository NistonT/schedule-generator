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
            format: 'json', // Указываем, что нужен только JSON
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 0, // Устанавливаем бесконечный таймаут
          },
        ),
      );

      // Извлекаем JSON из ответа
      const jsonResponse = this.extractJsonFromResponse(response.data);

      // Валидация и корректировка расписания
      const correctedSchedule = this.correctSchedule(jsonResponse, data);

      return correctedSchedule.response; // Возвращаем исправленное расписание
    } catch (error) {
      console.error('Error during API request:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  private correctSchedule(schedule: any, data: any): any {
    // Логика корректировки расписания
    // Например, проверка на превышение максимальной нагрузки, конфликты кабинетов и т.д.
    return schedule;
  }

  private formatPrompt(data: any): string {
    let prompt = `Создайте расписание на ${data.days} дней на основе следующих данных:\n`;

    // Добавляем информацию о кабинетах
    if (data.cabinets && data.cabinets.length > 0) {
      prompt += `Кабинеты:\n`;
      data.cabinets.forEach((cabinet) => {
        prompt += `- ${cabinet}\n`;
      });
    }

    // Добавляем информацию о группах
    if (data.groups && data.groups.length > 0) {
      prompt += `\nГруппы:\n`;
      data.groups.forEach((group) => {
        prompt += `- ${group}\n`;
      });
    }

    // Добавляем информацию о преподавателях
    if (data.teachers && data.teachers.length > 0) {
      prompt += `\nПреподаватели:\n`;
      data.teachers.forEach((teacher) => {
        prompt += `- ${teacher.name} (ID: ${teacher.tid})\n`;
      });
    }

    // Добавляем информацию о предметах
    if (data.subjectsMap && Object.keys(data.subjectsMap).length > 0) {
      prompt += `\nПредметы:\n`;
      for (const group in data.subjectsMap) {
        prompt += `Группа ${group}:\n`;
        data.subjectsMap[group].forEach((subject) => {
          prompt += `- ${subject}\n`;
        });
      }
    }

    // Добавляем информацию о связях преподавателей и предметов
    if (data.teachersMap && data.teachersMap.length > 0) {
      prompt += `\nСвязи преподавателей и предметов:\n`;
      data.teachersMap.forEach((link) => {
        prompt += `- Преподаватель ID ${link.tid} ведет предмет "${link.subject}" у группы "${link.group}"\n`;
      });
    }

    // Добавляем информацию о количестве часов и типах занятий
    if (data.amountLimits && data.amountLimits.length > 0) {
      prompt += `\nКоличество часов и типы занятий:\n`;
      data.amountLimits.forEach((limit) => {
        prompt += `- Группа ${limit.group}, предмет ${limit.subject}, количество часов: ${limit.amount}, тип занятия: ${limit.lessonType}\n`;
      });
    }

    // Добавляем информацию о кабинетах преподавателей (если есть)
    if (data.cabinetLimits && data.cabinetLimits.length > 0) {
      prompt += `\nОграничения по кабинетам для преподавателей:\n`;
      data.cabinetLimits.forEach((limit) => {
        prompt += `- Преподаватель ID ${limit.tid} может использовать кабинеты: ${limit.cabinets.join(', ')}\n`;
      });
    }

    // Добавляем информацию о максимальной нагрузке
    prompt += `\nМаксимальная нагрузка в день: ${data.maxLoad} пар\n`;

    // Добавляем информацию о часах для групп
    if (data.hours && Object.keys(data.hours).length > 0) {
      prompt += `\nЧасы для групп:\n`;
      for (const group in data.hours) {
        prompt += `- Группа ${group}: ${data.hours[group][0]} часов в первой подгруппе, ${data.hours[group][1]} часов во второй подгруппе\n`;
      }
    }

    // Добавляем формат выходных данных
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
    // Проверяем, что ответ уже в формате JSON
    if (typeof response === 'object') {
      return response;
    } else {
      throw new Error('Invalid JSON response');
    }
  }
}
