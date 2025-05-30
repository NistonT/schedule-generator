import { BadRequestException, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthTelegramService {
  private bot: Bot;

  constructor(private readonly prisma: PrismaService) {
    this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
    this.setupBot();
  }

  setupBot() {
    // Команда /start или /login — отправляем код
    this.bot.command(['start', 'login'], async (ctx) => {
      const user = ctx.from;
      if (!user) {
        await ctx.reply('Не удалось получить данные вашего Telegram-аккаунта.');
        return;
      }

      const telegram_id = user.id.toString();

      const userData = {
        telegram_id,
        firstName_telegram: user.first_name ?? null,
        lastName_telegram: user.last_name ?? null,
        username_telegram: user.username ?? null,
        authCode: Math.floor(10000 + Math.random() * 90000).toString(),
        authCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };

      const existingUser = await this.prisma.user.findUnique({
        where: { telegram_id },
      });

      if (existingUser) {
        // Обновляем только нужные поля
        await this.prisma.user.update({
          where: { telegram_id },
          data: userData,
        });
      } else {
        // Если пользователь ещё не зарегистрирован — можно создать заглушку
        // Или оставить это на фронтенде (если регистрация через сайт)
        await ctx.reply(
          `Вы ещё не зарегистрированы. Введите код "${userData.authCode}" на сайте.`,
        );
      }

      await ctx.reply(`Ваш код для авторизации: ${userData.authCode}`);
    });

    this.bot.start();
  }

  getBotInstance() {
    return this.bot;
  }

  // Отправляет 5-значный код пользователю в Telegram
  async sendLoginCodeToTelegram(telegram_id: string): Promise<string> {
    const authCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5 цифр
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    await this.prisma.user.update({
      where: { telegram_id },
      data: {
        authCode,
        authCodeExpiresAt: expiresAt,
      },
    });

    await this.bot.api.sendMessage(
      telegram_id,
      `Ваш код для входа: ${authCode}`,
    );

    return authCode;
  }

  // Проверяет, совпадает ли введенный код с тем, что в БД
  async validateLoginCode(telegram_id: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { telegram_id },
    });

    if (!user || user.authCode !== code) {
      return false;
    }

    if (new Date() > user.authCodeExpiresAt) {
      return false;
    }

    return true;
  }

  // Очищает код после успешного входа
  async clearLoginCode(telegram_id: string) {
    await this.prisma.user.updateMany({
      where: { telegram_id },
      data: {
        authCode: null,
        authCodeExpiresAt: null,
      },
    });
  }

  // Находит пользователя по коду (для сайта)
  async findUserByAuthCode(authCode: string) {
    return await this.prisma.user.findFirst({
      where: {
        authCode,
        authCodeExpiresAt: { gte: new Date() }, // код не истёк
      },
    });
  }

  // Находит пользователя по telegram_id
  async findUserByTelegramId(telegram_id: string) {
    return await this.prisma.user.findUnique({
      where: { telegram_id },
    });
  }

  // Привязывает telegram_id к пользователю (после ввода кода на сайте)
  async linkTelegramToUser(userId: string, telegram_id: string) {
    // Проверяем, есть ли уже пользователь с таким telegram_id
    const existingUserWithTg = await this.prisma.user.findUnique({
      where: { telegram_id },
    });

    if (existingUserWithTg && existingUserWithTg.id !== userId) {
      throw new BadRequestException(
        'Этот Telegram уже привязан к другому аккаунту',
      );
    }

    // Обновляем текущего пользователя
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        telegram_id,
        firstName_telegram: existingUserWithTg?.firstName_telegram || null,
        lastName_telegram: existingUserWithTg?.lastName_telegram || null,
        username_telegram: existingUserWithTg?.username_telegram || null,
      },
    });
  }

  // Уведомление пользователя в Telegram
  async notifyUserLogin(telegram_id: string, message: string) {
    try {
      await this.bot.api.sendMessage(telegram_id, message);
    } catch (e) {
      console.error('Ошибка при отправке сообщения в Telegram:', e);
    }
  }
}
