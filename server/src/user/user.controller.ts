import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentUser } from 'src/auth/decorators/user.decorators';
import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Получение всех пользователей по url:
  // GET localhost:5555/api/user/users
  @Get('/users')
  @Auth()
  public async getByUsers(): Promise<User[]> {
    return await this.userService.getByAll();
  }

  // Получение определенного пользователя по url:
  // GET localhost:5555/api/user/user_id
  @Get('/user_id')
  @Auth()
  public async getById(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  // Обновленние данные пользователя по url
  // PUT localhost:5555/api/user/update
  // {
  // "username": ?string,
  // "email": ?string,
  // "password": ?string
  // }
  @UsePipes(new ValidationPipe())
  @HttpCode(202)
  @Put('/update')
  @Auth()
  public async updateUser(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, dto);
  }

  // Удаление пользователя по url
  // Delete localhost:5555/api/user
  @Delete()
  @Auth()
  public async deleteUser(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }

  // Обновленние api-key пользователя по url
  // PUT localhost:5555/api/user/api_key
  @Put('/api_key')
  @HttpCode(202)
  @Auth()
  public async updateApiKey(@CurrentUser('id') id: string) {
    return await this.userService.updateApiKey(id);
  }

  // Проверка пароля пользователя по url
  // POST localhost:5555/api/user/check
  @Post('/check')
  @HttpCode(202)
  @Auth()
  public async checkPasswords(
    @CurrentUser('id') id: string,
    @Body('password') password: string,
  ) {
    return await this.userService.checkPassword(id, password);
  }
}
