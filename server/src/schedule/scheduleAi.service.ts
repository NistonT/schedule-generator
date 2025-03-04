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
        content: `Ты генератор расписаний. Строго соблюдай правила:
			
			1. Формат ответа: 
			{
				"timetable": {
					"YYYY-MM-DD": [массив уроков],
					...
				}
			}
			
			2. Ключевые требования:
			• Общее количество занятий по каждому предмету ДОЛЖНО соответствовать amountLimits
			• Максимальное количество пар в день (maxLoad) - ${scheduleData.maxLoad}
			• При распределении занятий сначала заполняй обязательные часы из параметра hours
			
			3. Особенности генерации:
			→ Если hours содержит [0,0] - распределяй занятия равномерно по дням
			→ Для lessonType "L" создавай одно занятие на всю группу
			→ При наличии нескольких дней распределяй занятия пропорционально
			→ Если общее количество занятий превышает дни × maxLoad - увеличивай maxLoad
			
			Пример для amountLimits.amount=10 и 4 дней:
			2025-03-13: 3 занятия
			2025-03-14: 3 занятия
			2025-03-15: 2 занятия
			2025-03-16: 2 занятия
			Итого: 10 занятий
			
			Текущие amountLimits: 
			${JSON.stringify(scheduleData.amountLimits, null, 2)}
			
			Никакого текста кроме JSON! Ответ должен быть полным и содержать ВСЕ требуемые занятия.`,
      };

      const response: AxiosResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'qwen/qwen2.5-vl-72b-instruct:free',
          response_format: { type: 'json_object' },
          temperature: 0.3, // Немного увеличим для гибкости
          top_p: 0.95,
          max_tokens: 4000, // Увеличим лимит токенов
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
}
