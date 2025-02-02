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

      return response.data; // Возвращаем результат
    } catch (error) {
      console.error('Error during API request:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  private formatPrompt(data: any): string {
    let prompt = `Generate a timetable based on the following data:\n`;

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

    // Добавляем информацию о предметах
    if (data.t_subjects && data.t_subjects.length > 0) {
      prompt += `\nSubjects:\n`;
      data.t_subjects.forEach((subject) => {
        prompt += `ID: ${subject.id}, Name: ${subject.name}, Group ID: ${subject.group_id}\n`;
      });
    }

    // Добавляем формат выходных данных
    prompt += `\nPlease generate a timetable in the following JSON format:\n`;
    prompt += `{\n`;
    prompt += `  "timetable": {\n`;
    prompt += `    "<date>": [\n`;
    prompt += `      {\n`;
    prompt += `        "time": "<start>-<end>",\n`;
    prompt += `        "room": "<room_name>",\n`;
    prompt += `        "teacher": "<teacher_name>",\n`;
    prompt += `        "subject": "<subject_name>",\n`;
    prompt += `        "group": "<group_name>"\n`;
    prompt += `      }\n`;
    prompt += `    ]\n`;
    prompt += `  }\n`;
    prompt += `}`;

    return prompt;
  }
}
