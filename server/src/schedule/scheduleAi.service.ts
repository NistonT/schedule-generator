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

    // Проверка наличия токена
    if (!OPENROUTER_API_KEY) {
      throw new Error('TOKEN_AI не установлен');
    }

    try {
      // Формирование системного сообщения
      const systemMessage = {
        role: 'system',
        content: `
          Ты — система для генерации расписания занятий. 
          На вход ты получаешь данные о кабинетах, группах, учителях, предметах, ограничениях и днях.
          Твоя задача — сгенерировать полное расписание в следующем формате:
          {
            "groupTimetables": {
              "<название группы>": {
                "<дата>": [
                  [
                    {
                      "group": "<название группы>",
                      "cabinet": "<номер кабинета>",
                      "subject": "<название предмета>",
                      "teacher": "<имя учителя>",
                      "lessonType": "<тип урока>"
                    }
                  ],
                  ...
                ]
              },
              ...
            }
          }
          Убедись, что расписание соответствует всем ограничениям:
          - amountLimits: Количество занятий по каждому предмету должно точно соответствовать указанному значению.
          - maxLoad: Максимальная нагрузка для каждой группы в день не должна превышать указанное значение.
          - cabinetLimits: Кабинеты не должны использоваться одновременно разными группами.
          - teachersMap: Учителя должны быть назначены только на те предметы и группы, которые указаны.
          Пример корректного расписания:
          {
            "groupTimetables": {
              "Г1": {
                "2023-10-01": [
                  [
                    {
                      "group": "Г1",
                      "cabinet": "101",
                      "subject": "Математика",
                      "teacher": "Иванов",
                      "lessonType": "L"
                    }
                  ],
                  [
                    {
                      "group": "Г1",
                      "cabinet": "102",
                      "subject": "Физика",
                      "teacher": "Петрова",
                      "lessonType": "L"
                    }
                  ]
                ],
                "2023-10-02": [
                  [
                    {
                      "group": "Г1",
                      "cabinet": "101",
                      "subject": "Математика",
                      "teacher": "Иванов",
                      "lessonType": "L"
                    }
                  ]
                ]
              }
            }
          }
          Если ты не можешь сгенерировать полное расписание, верни частичное расписание, но постарайся учесть все ограничения.
        `,
      };

      // Формирование пользовательского сообщения
      const userMessage = {
        role: 'user',
        content: JSON.stringify(scheduleData),
      };

      // Отправка POST-запроса в API OpenRouter
      const response: AxiosResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'qwen/qwen2.5-vl-72b-instruct:free', // Указываем модель
          response_format: { type: 'json_object' }, // Формат ответа
          messages: [systemMessage, userMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`, // Токен авторизации
            'HTTP-Referer': YOUR_SITE_URL, // URL вашего сайта
            'X-Title': YOUR_SITE_NAME, // Название вашего сайта
            'Content-Type': 'application/json', // Тип контента
          },
        },
      );

      // Логируем полный ответ API для отладки
      console.log('Полный ответ API:', response.data);

      // Извлекаем содержимое поля content из ответа
      const content = response.data.choices[0].message.content;

      // Попытка распарсить JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        // Если JSON некорректный, пытаемся исправить его
        console.warn('Некорректный JSON, попытка исправления...');
        const fixedContent = this.fixJson(content);
        parsedContent = JSON.parse(fixedContent);
      }

      // Возвращаем распарсенный объект
      return parsedContent;
    } catch (error) {
      // Логируем ошибку и выбрасываем исключение
      console.error('Ошибка при генерации расписания:', error);
      throw error; // Перебрасываем ошибку дальше
    }
  }

  /**
   * Исправляет некорректный JSON
   */
  private fixJson(jsonString: string): string {
    // Удаляем лишние символы и пробелы
    jsonString = jsonString.trim();
    if (!jsonString.startsWith('{')) {
      jsonString = '{' + jsonString;
    }
    if (!jsonString.endsWith('}')) {
      jsonString = jsonString + '}';
    }

    // Заменяем одинарные кавычки на двойные
    jsonString = jsonString.replace(/'/g, '"');

    // Убираем запятые перед закрывающей скобкой
    jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');

    // Убираем лишние запятые между элементами массива
    jsonString = jsonString.replace(/,\s*,/g, ',');

    // Убираем лишние символы в конце строки
    jsonString = jsonString.replace(/[\n\r]+/g, '');

    return jsonString;
  }
}
