import { IsEmail, IsString } from 'class-validator';

export class RegisterAuth {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
