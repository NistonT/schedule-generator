import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddFeedbackDto } from './feedback/dto/feedback.type';
import { FeedbackService } from './feedback/feedback.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';

describe('FeedbackController', () => {
  let feedbackService: FeedbackService;
  let prismaService: any;
  let userService: any;

  beforeEach(async () => {
    // Создаем тестовый модуль с моками зависимостей
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          // Мокируем PrismaService
          provide: PrismaService,
          useValue: {
            feedback: {
              create: jest.fn(), // используем jest.fn() для мока метода create
            },
          },
        },
        {
          // Мокируем UserService
          provide: UserService,
          useValue: {
            getById: jest.fn(), // заглушка для getById
          },
        },
      ],
    }).compile();

    // Получаем экземпляры сервисов из модуля
    feedbackService = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get(PrismaService);
    userService = module.get(UserService);
  });

  describe('add', () => {
    // Пример данных пользователя и DTO
    const userId = 'user-id';
    const dto: AddFeedbackDto = {
      title: 'Test Title',
      text: 'Test feedback text',
    };

    // Моковый пользователь (все обязательные поля должны быть)
    const mockUser = {
      id: userId,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      telegram_id: null,
      firstName_telegram: null,
      lastName_telegram: null,
      username_telegram: null,
      authCode: null,
      authCodeExpiresAt: null,
      api_key: 'mock-api-key',
      visits: 0,
      feedback_count: 0,
      role: 'USER',
    };

    // Моковый объект отзыва
    const mockFeedback = {
      id: 'feedback-id',
      user_id: userId,
      title: dto.title,
      text: dto.text,
      name: mockUser.username,
      feedback_admin: '',
      admin: '',
      isCheck: false,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    it('должен успешно добавить отзыв', async () => {
      // Мокируем успешное получение пользователя
      userService.getById.mockResolvedValue(mockUser);

      // Мокируем успешное создание отзыва в Prisma
      prismaService.feedback.create.mockResolvedValue(mockFeedback);

      // Вызываем тестируемый метод
      const result = await feedbackService.add(dto, userId);

      // Проверяем, что userService.getById был вызван с правильным ID
      expect(userService.getById).toHaveBeenCalledWith(userId);

      // Проверяем, что prisma.feedback.create был вызван с нужными данными
      expect(prismaService.feedback.create).toHaveBeenCalledWith({
        data: {
          user_id: mockUser.id,
          title: dto.title,
          text: dto.text,
          name: mockUser.username,
        },
      });

      // Проверяем, что результат соответствует ожидаемому
      expect(result).toEqual(mockFeedback);
    });

    it('должен выкинуть ошибку, если user_id пустой', async () => {
      // Если передан пустой userId — сервис должен бросить исключение
      await expect(feedbackService.add(dto, '')).rejects.toThrow(
        new BadRequestException('Идентификтатор пользователя не найден'),
      );
    });

    it('должен выкинуть ошибку, если пользователь не найден', async () => {
      // Симулируем ситуацию, когда пользователя нет в системе
      userService.getById.mockResolvedValue(null);

      // Ожидаем выброс ошибки
      await expect(feedbackService.add(dto, userId)).rejects.toThrow(
        new BadRequestException('Пользователь не найден'),
      );
    });
  });
});
