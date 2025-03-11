import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { Cabinets } from './dto/cabinets.type';

@Injectable()
export class CabinetsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // Добавить кабинет
  async addCabinet(name: string, apiKey: string): Promise<Schedule> {
    if (!name) {
      throw new BadRequestException('Вы не ввели название кабинета');
    }

    if (!apiKey) {
      throw new UnauthorizedException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (!schedule) {
      throw new BadRequestException('api ключ неверный');
    }

    const filterCabinets = schedule.cabinets.filter(
      (cabinet) => cabinet === name,
    );

    if (filterCabinets) {
      throw new ConflictException('Кабинет уже создан!');
    }

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        cabinets: {
          push: name,
        },
      },
    });
  }

  // Вывести кабинеты
  async getCabinets(apiKey: string): Promise<Cabinets[]> {
    if (!apiKey) {
      throw new UnauthorizedException('Вы не ввели ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return await this.prisma.schedule.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        cabinets: true,
      },
    });
  }

  // Изменить кабинет
  async changeCabinet(
    oldName: string,
    newName: string,
    apiKey: string,
  ): Promise<Schedule> {
    if (!oldName) {
      throw new BadRequestException('Вы не ввели существующего кабинета');
    }

    if (!newName) {
      throw new BadRequestException('Вы не введи новое название кабинета');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не введи api ключ');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    const cabinetIndex = schedule.cabinets.indexOf(oldName);

    if (cabinetIndex === -1) {
      throw new BadRequestException(`Кабинет ${oldName} не найден`);
    }

    const cabinetUpdate = [...schedule.cabinets];
    cabinetUpdate[cabinetIndex] = newName;

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        cabinets: cabinetUpdate,
      },
    });
  }

  // Удалить кабинет
  async deleteCabinet(name: string, apiKey: string): Promise<Schedule> {
    if (!name) {
      throw new BadRequestException('Вы не ввели название кабинета');
    }

    if (!apiKey) {
      throw new BadRequestException('Вы не введи ключ api');
    }

    const user = await this.userService.getByApiKey(apiKey);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (!schedule) {
      throw new BadRequestException('Расписание не найден');
    }

    const deleteCabinets = schedule.cabinets.filter(
      (cabinet) => cabinet !== name,
    );

    return await this.prisma.schedule.update({
      where: {
        user_id: user.id,
      },
      data: {
        cabinets: deleteCabinets,
      },
    });
  }
}
