import { IsString } from 'class-validator';

export class AuthDto {
  @IsString({
    message: 'Имя пользователя должнен быть строкой',
  })
  username: string;

  @IsString({
    message: 'Пароль должнен быть строкой',
  })
  password: string;
}
