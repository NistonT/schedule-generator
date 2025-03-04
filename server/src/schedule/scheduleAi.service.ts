import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduleAiService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async generateSchedule(scheduleData: any): Promise<any> {
    const OPENROUTER_API_KEY = process.env.TOKEN_AI;
    const YOUR_SITE_URL = process.env.DOMAIN || '';
    const YOUR_SITE_NAME = process.env.NAME_SITE || '';

    if (!OPENROUTER_API_KEY) throw new Error('TOKEN_AI не установлен');

    try {
      const systemMessage = {
        role: 'system',
        content: this.generateSystemContent(scheduleData),
      };

      const response: AxiosResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'qwen/qwen2.5-vl-72b-instruct:free',
          response_format: { type: 'json_object' },
          temperature: 0.3,
          top_p: 0.95,
          max_tokens: 4000,
          messages: [
            systemMessage,
            {
              role: 'user',
              content: JSON.stringify({
                ...scheduleData,
                priority_rules: ['amountLimits', 'maxLoad', 'hours'],
              }),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': YOUR_SITE_URL,
            'X-Title': YOUR_SITE_NAME,
            'Content-Type': 'application/json',
          },
        },
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error.response?.data || error.message);
      throw new Error(`Ошибка ИИ: ${error.message}`);
    }
  }

  private generateSystemContent(scheduleData: any): string {
    return `Ты генератор учебных расписаний. Строго соблюдай правила:

1. Формат ответа:
{
  "timetable": {
    "YYYY-MM-DD": [
      {
        "group": "название группы",
        "subject": "название предмета",
        "teacher": "ФИО преподавателя",
        "cabinet": "номер кабинета",
        "lessonType": "L|1|2"
      }
    ]
  }
}

2. Входные параметры:
${this.formatCabinets(scheduleData.cabinets)}
${this.formatGroups(scheduleData.groups)}
${this.formatTeachers(scheduleData.teachers)}
${this.formatSubjectsMap(scheduleData.subjectsMap)}
${this.formatTeachersMap(scheduleData.teachersMap)}
${this.formatCabinetLimits(scheduleData.cabinetLimits)}
${this.formatAmountLimits(scheduleData.amountLimits)}
${this.formatDays(scheduleData.days)}
${this.formatHours(scheduleData.hours)}
• Макс. пары/день: ${scheduleData.maxLoad}

3. Критические правила:
→ L-тип: для всей группы
→ 1/2-тип: раздельные подгруппы
→ Кабинеты должны соответствовать ограничениям
→ Преподаватели только свои предметы
→ Строго соблюдать лимиты занятий
→ Распределение: равномерное по дням (если hours = [0,0])

4. Пример для ${scheduleData.maxLoad} пар/день:
{
  "timetable": {
    "2025-03-13": ${JSON.stringify(
      Array(scheduleData.maxLoad).fill({
        group: 'Г1',
        subject: 'Пример',
        teacher: 'Преподаватель',
        cabinet: '101',
        lessonType: 'L',
      }),
    )}
  }
}

5. Запрещено:
× Менять структуру JSON
× Добавлять текстовые комментарии
× Использовать непредусмотренные данные

Сгенерируй ТОЛЬКО валидный JSON!`;
  }

  private formatCabinets(cabinets: string[]): string {
    return `• Кабинеты: ${cabinets?.join(', ') || 'Не указаны'}\n`;
  }

  private formatGroups(groups: string[]): string {
    return `• Группы: ${groups?.join(', ') || 'Не указаны'}\n`;
  }

  private formatTeachers(teachers: any[]): string {
    if (!teachers?.length) return '• Преподаватели: Не указаны\n';
    return `• Преподаватели:\n${teachers
      .map((t) => `  - ${t.name} (ID: ${t.tid})`)
      .join('\n')}\n`;
  }

  private formatSubjectsMap(subjectsMap: Record<string, string[]>): string {
    if (!subjectsMap) return '• Предметы по группам: Не указаны\n';
    return `• Предметы по группам:\n${Object.entries(subjectsMap)
      .map(([group, subjects]) => `  - ${group}: ${subjects.join(', ')}`)
      .join('\n')}\n`;
  }

  private formatTeachersMap(teachersMap: any[]): string {
    if (!teachersMap?.length)
      return '• Назначения преподавателей: Нет данных\n';
    return `• Назначения преподавателей:\n${teachersMap
      .map(
        (tm) =>
          `  - Преподаватель ID:${tm.tid} ведет "${tm.subject}" у группы ${tm.group}`,
      )
      .join('\n')}\n`;
  }

  private formatAmountLimits(amountLimits: any[]): string {
    if (!amountLimits?.length) return '• Лимиты занятий: Не заданы\n';
    return `• Лимиты занятий:\n${amountLimits
      .map(
        (al) =>
          `  - Группа ${al.group}: ${al.amount} пар по "${al.subject}" (тип ${al.lessonType})`,
      )
      .join('\n')}\n`;
  }

  private formatCabinetLimits(cabinetLimits: any[]): string {
    if (!cabinetLimits?.length)
      return '• Ограничения кабинетов: Нет ограничений\n';
    return `• Ограничения кабинетов:\n${cabinetLimits
      .map(
        (cl) =>
          `  - Преподаватель ID:${cl.tid} может использовать: ${cl.cabinets.join(', ')}`,
      )
      .join('\n')}\n`;
  }

  private formatDays(days: string[]): string {
    if (!days?.length) return '• Дни не указаны\n';
    return `• Учебные дни:\n${days.map((d) => `  - ${d}`).join('\n')}\n`;
  }

  private formatHours(hours: Record<string, number[]>): string {
    if (!hours) return '• Часы подгрупп: Не распределены\n';
    return `• Часы подгрупп:\n${Object.entries(hours)
      .map(
        ([group, h]) =>
          `  - Группа ${group}: Подгруппа 1 - ${h[0]}ч, Подгруппа 2 - ${h[1]}ч`,
      )
      .join('\n')}\n`;
  }
}
