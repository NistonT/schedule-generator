import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  async getByUsers(): Promise<User[]> {
    return await this.userService.getByAll();
  }

  // Получение определенного пользователя по url:
  // GET localhost:5555/api/user/user_id
  @Get('/user_id')
  @Auth()
  async getById(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  // Обновленние данные пользователя по url
  // PUT localhost:5555/api/user/user_id
  // {
  // "username": ?string,
  // "email": ?string,
  // "password": ?string
  // }
  @UsePipes(new ValidationPipe())
  @HttpCode(202)
  @Put('/update')
  @Auth()
  async updateUser(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, dto);
  }
}
