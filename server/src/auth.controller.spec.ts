import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { RegisterAuth } from './user/dto/register.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      addRefreshTokenToResponse: jest.fn(), // Добавляем мок метода
    } as any;

    authController = new AuthController(authService);
  });

  describe('register', () => {
    const dto: RegisterAuth = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const tokens = {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };

    const userResponse = {
      id: '1',
      username: dto.username,
      email: dto.email,
      telegram_id: null,
      firstName_telegram: null,
      lastName_telegram: null,
      username_telegram: null,
      authCode: null,
      authCodeExpiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      api_key: 'mock-api-key',
      visits: 0,
      feedback_count: 0,
      role: 'USER',
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    const result = {
      ...tokens,
      user: userResponse,
    };

    it('должен возвращать пользователя и access token при успешной регистрации', async () => {
      // Мокируем оба метода
      jest.spyOn(authService, 'register').mockResolvedValue(result);
      jest
        .spyOn(authService, 'addRefreshTokenToResponse')
        .mockImplementation(() => {});

      const mockResponse = {} as any;
      const response = await authController.register(dto, mockResponse);

      expect(response).toEqual({
        user: userResponse,
        accessToken: tokens.accessToken,
      });
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(authService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        mockResponse,
        tokens.refreshToken,
      );
    });

    it('должен выбрасывать BadRequestException если пользователь уже существует', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(
          new BadRequestException('Пользователь уже существует'),
        );

      await expect(authController.register(dto, {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
