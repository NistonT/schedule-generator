import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import * as cuid from 'cuid';
import { console } from 'inspector';
import { PrismaService } from '../prisma.service';
import { RegisterAuth } from './dto/register.dto';
import { UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Создайние пользователя
  public async create(dto: RegisterAuth): Promise<User> {
    return await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: await hash(dto.password),
        schedule: {
          create: {
            schedule: {},
          },
        },
      },
      include: {
        schedule: true,
      },
    });
  }

  // Получение всех пользователей
  public async getByAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  // Получение пользователя по id
  public async getById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        schedule: true,
      },
    });
  }

  // Получение пользователя по api-key
  public async getByApiKey(api_key: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        api_key,
      },
    });
  }

  // Получение пользователя по имени
  public async getByUsername(username): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        schedule: true,
      },
    });
  }

  // Обновленние пользователя по id
  public async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    let data = dto;

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  // Проверка пароля
  public async checkPassword(id: string, password: string) {
    const user = await this.getById(id);

    console.log(user.password);
    console.log(password);

    if (!user.password.startsWith('$')) {
      throw new Error('Неверный формат хэша пароля');
    }

    console.log(user.password);
    console.log(password);

    const isCheck = await verify(user.password, password);

    console.log(isCheck);

    if (!isCheck) {
      throw new NotFoundException('Пароли не совпадают');
    }

    console.log(isCheck);

    return isCheck;
  }

  // Удаление пользователя по id
  public async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  // Обновленние api key
  public async updateApiKey(id: string) {
    let isUnique = false;
    let newApiKey: string;

    while (!isUnique) {
      newApiKey = cuid();
      const existingUser = await this.prisma.user.findUnique({
        where: { api_key: newApiKey },
      });

      if (!existingUser) {
        isUnique = true;
      }
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        api_key: newApiKey,
      },
    });
  }

  // Счетчик входа в аккаунт
  public async updateCount(id: string) {
    const user = await this.getById(id);

    const userCount = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        visits: user.visits + 1,
      },
    });

    return userCount;
  }
}
