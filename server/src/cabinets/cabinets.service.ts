import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CabinetsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private async validateUserAndSchedule(apiKey: string, scheduleId?: string) {
    if (!apiKey?.trim()) {
      throw new UnauthorizedException('API ключ обязателен');
    }

    const user = await this.userService.getByApiKey(apiKey);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const schedule = scheduleId
      ? await this.prisma.schedule.findFirst({
          where: { id: scheduleId, user_id: user.id },
        })
      : await this.prisma.schedule.findFirst({
          where: { user_id: user.id },
          orderBy: { CreatedAt: 'desc' },
        });

    if (!schedule) {
      throw new NotFoundException('Расписание не найдено');
    }

    return { user, schedule };
  }

  async addCabinet(
    name: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!name?.trim()) {
      throw new BadRequestException('Название кабинета обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    if (schedule.cabinets.includes(name)) {
      throw new ConflictException(`Кабинет "${name}" уже существует`);
    }

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        cabinets: {
          push: name,
        },
      },
    });

    return updatedSchedule.cabinets;
  }

  async getCabinets(apiKey: string, scheduleId?: string): Promise<string[]> {
    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);
    return schedule.cabinets;
  }

  async getAllCabinets(
    apiKey: string,
  ): Promise<{ id: string; cabinets: string[] }[]> {
    const user = await this.validateUserAndSchedule(apiKey);
    const schedules = await this.prisma.schedule.findMany({
      where: { user_id: user.user.id },
      select: { id: true, cabinets: true },
    });
    return schedules;
  }

  async changeCabinet(
    oldName: string,
    newName: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!oldName?.trim()) {
      throw new BadRequestException('Текущее название кабинета обязательно');
    }
    if (!newName?.trim()) {
      throw new BadRequestException('Новое название кабинета обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    const cabinetIndex = schedule.cabinets.indexOf(oldName);
    if (cabinetIndex === -1) {
      throw new NotFoundException(`Кабинет "${oldName}" не найден`);
    }

    if (schedule.cabinets.includes(newName)) {
      throw new ConflictException(`Кабинет "${newName}" уже существует`);
    }

    const updatedCabinets = [...schedule.cabinets];
    updatedCabinets[cabinetIndex] = newName;

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { cabinets: updatedCabinets },
    });

    return updatedSchedule.cabinets;
  }

  async deleteCabinet(
    name: string,
    apiKey: string,
    scheduleId?: string,
  ): Promise<string[]> {
    if (!name?.trim()) {
      throw new BadRequestException('Название кабинета обязательно');
    }

    const { schedule } = await this.validateUserAndSchedule(apiKey, scheduleId);

    if (!schedule.cabinets.includes(name)) {
      throw new NotFoundException(`Кабинет "${name}" не найден`);
    }

    const updatedCabinets = schedule.cabinets.filter(
      (cabinet) => cabinet !== name,
    );

    const updatedSchedule = await this.prisma.schedule.update({
      where: { id: schedule.id },
      data: { cabinets: updatedCabinets },
    });

    return updatedSchedule.cabinets;
  }
}
