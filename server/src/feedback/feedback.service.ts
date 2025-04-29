import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AddFeedbackDto,
  AdminFeedbackDto,
  ChangeFeedbackDto,
} from './dto/feedback.type';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Добавить запись
  public async add(dto: AddFeedbackDto, user_id: string) {
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
        name: user.username,
      },
    });

    return addFeedback;
  }

  // Ответить на запись
  public async feedback_admin(dto: AdminFeedbackDto, feedback_id: string) {
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

  // Вывод одной записи
  public async getId(feedback_id: string) {
    if (!feedback_id) {
      throw new BadRequestException('Запись не найдена');
    }

    const feedback = await this.prisma.feedback.findFirst({
      where: {
        id: feedback_id,
      },
    });

    return feedback;
  }

  public async get(user_id: string) {
    if (!user_id) {
      throw new BadRequestException('Идентификатор пользователя не найден');
    }

    const user = await this.userService.getById(user_id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const feedback = await this.prisma.feedback.findMany({
      where: {
        user_id: user.id,
      },
    });

    return feedback;
  }

  // Вывод всех обращений
  public async getAll() {
    const feedback = await this.prisma.feedback.findMany();

    return feedback;
  }

  // Изменить запись
  public async put(dto: ChangeFeedbackDto, feedback_id: string) {
    if (!feedback_id) {
      throw new BadRequestException('Идентификатор обратной связи не найден');
    }

    const feedback = await this.prisma.feedback.update({
      where: {
        id: feedback_id,
      },
      data: {
        title: dto.title,
        text: dto.text,
        admin: dto.admin,
        feedback_admin: dto.feedback_admin,
        isCheck: dto.isCheck,
      },
    });

    return feedback;
  }

  // Удалить запись
  public async delete(feedback_id: string) {
    const delete_feedback = await this.prisma.feedback.delete({
      where: {
        id: feedback_id,
      },
    });

    return delete_feedback;
  }
}
