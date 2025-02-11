import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import * as cuid from 'cuid';
import { PrismaService } from 'src/prisma.service';
import { RegisterAuth } from './dto/register.dto';
import { UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Создайние пользователя
  async create(dto: RegisterAuth): Promise<User> {
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
  async getByAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  // Получение пользователя по id
  async getById(id: string): Promise<User> {
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
  async getByApiKey(api_key: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        api_key,
      },
    });
  }

  // Получение пользователя по имени
  async getByUsername(username): Promise<User> {
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
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
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

  // Обновленние api key
  async updateApiKey(id: string) {
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
}
