import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentUser } from 'src/auth/decorators/user.decorators';
import { AuthTelegramService } from './auth-telegram.service';

@Controller('auth-telegram')
export class AuthTelegramController {
  constructor(private readonly authTelegramService: AuthTelegramService) {}

  // Telegram Webhook (если используется через вебхуки, а не long-polling)
  @Post('webhook')
  handleWebhook(@Body() update: any) {
    this.authTelegramService.getBotInstance().handleUpdate(update);
    return { success: true };
  }

  // Проверка кода авторизации (для привязки или входа)
  @Post('verify')
  async verifyAuthCode(@Body() body: { authCode: string }) {
    const { authCode } = body;

    if (!authCode || authCode.length !== 5) {
      throw new BadRequestException('Код должен содержать 5 цифр');
    }

    const user = await this.authTelegramService.findUserByAuthCode(authCode);

    if (!user) {
      return {
        success: false,
        message: 'Неверный или просроченный код',
      };
    }

    // Очищаем код после использования
    await this.authTelegramService.clearLoginCode(user.telegram_id);

    return {
      success: true,
      telegram_id: user.telegram_id,
      message: 'Код успешно проверен',
    };
  }

  // Пример: Привязка Telegram к пользователю по telegram_id и code
  @Auth()
  @Post('link')
  async linkTelegramAccount(
    @Body() body: { telegram_id: string; code: string },
    @CurrentUser('id') id: string,
  ) {
    const { telegram_id, code } = body;
    console.log('Получен запрос:', body);
    // Проверяем, совпадает ли код у пользователя
    const isValid = await this.authTelegramService.validateLoginCode(
      telegram_id,
      code,
    );

    if (!isValid) {
      return {
        success: false,
        message: 'Неверный или истёкший код',
      };
    }

    try {
      // Привязываем Telegram ID к пользователю
      await this.authTelegramService.linkTelegramToUser(id, telegram_id);

      return {
        success: true,
        message: 'Telegram успешно привязан к вашему аккаунту',
      };
    } catch (e) {
      return {
        success: false,
        message: e.message || 'Ошибка при привязке аккаунта',
      };
    }
  }

  // Отправка уведомления о входе (пример)
  @Post('notify-login')
  async notifyLogin(@Body() body: { telegram_id: string; deviceInfo: any }) {
    const { telegram_id, deviceInfo } = body;

    const user =
      await this.authTelegramService.findUserByTelegramId(telegram_id);

    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    const message = `
🔔 Вход в ваш аккаунт:
Имя: ${user.firstName_telegram || 'Не указано'}
ID: ${user.telegram_id}
Устройство: ${deviceInfo.deviceType || 'Неизвестно'}
Браузер: ${deviceInfo.browser || 'Неизвестно'}
ОС: ${deviceInfo.os || 'Неизвестно'}
Мобильное устройство: ${deviceInfo.isMobile ? 'Да' : 'Нет'}
User-Agent: ${deviceInfo.userAgent || 'Неизвестно'}
`;

    await this.authTelegramService.notifyUserLogin(telegram_id, message);

    return { success: true, message: 'Уведомление отправлено' };
  }
}
