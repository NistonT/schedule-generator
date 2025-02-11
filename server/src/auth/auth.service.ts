import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterAuth } from './dto/register.dto';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  // Вход в систему
  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueToken(user.id);

    return {
      user,
      ...tokens,
    };
  }

  // Регистрация пользователя
  async register(dto: RegisterAuth) {
    const oldUser = await this.userService.getByUsername(dto.username);

    console.log(oldUser);
    if (oldUser)
      throw new BadRequestException(
        'Пользователь уже с таким именем зарегестрирован',
      );

    const { password, ...user } = await this.userService.create(dto);

    const tokens = this.issueToken(user.id);

    return {
      user,
      ...tokens,
    };
  }

  // Регистрация токенов
  private issueToken(user_id: string) {
    const data = { id: user_id };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // Валидация пользователя
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByUsername(dto.username);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Пароль неверный');

    return user;
  }

  // Полученние нового токена
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Токен не валидный');

    const { password, ...user } = await this.userService.getById(result.id);

    const tokens = this.issueToken(user.id);

    return {
      user,
      ...tokens,
    };
  }

  // Добавление Refresh токен
  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  // Удаление Refresh токена
  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: new Date(0),
      secure: true,
      sameSite: 'lax',
    });
  }
}
