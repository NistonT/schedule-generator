import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddFeedbackDto, ChangeFeedbackDto } from './dto/feedback.type';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Добавить запись
  async add(dto: AddFeedbackDto, user_id: string) {
    const { text, title } = dto;

    if (!user_id) {
      throw new BadRequestException('Идентификтатор пользователя не найден');
    }

    const user = await this.userService.getById(user_id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const addFeedback = await this.prisma.feedback.create({
      data: {
        user_id: user.id,
        title,
        text,
      },
    });

    return addFeedback;
  }

  // Ответить на запись
  async feedback_admin(dto: ChangeFeedbackDto, feedback_id: string) {
    const { feedback_admin, isCheck, admin } = dto;

    if (!feedback_id) {
      throw new BadRequestException('Идентификатор обратной связи не найден');
    }

    const feedback = await this.prisma.feedback.update({
      where: {
        id: feedback_id,
      },
      data: {
        admin,
        feedback_admin,
        isCheck,
      },
    });

    return feedback;
  }

  async get(user_id: string) {
    const user = await this.userService.getById(user_id);
  }

  // Вывод всех обращений
  async getAll() {
    const feedback = await this.prisma.feedback.findMany();

    return feedback;
  }

  // Изменить запись
  async put(dto: ChangeFeedbackDto, user_id: string, feedback_id: string) {}

  // Удалить запись
  async delete(user_id: string, feedback_id: string) {}
}
