import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { RegisterAuth } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RegisterAuth) {
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

  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        schedule: true,
      },
    });
  }

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
}
