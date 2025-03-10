import {
  BadRequestException,
  ConflictException,
  Injectable,
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

  async addCabinet(name: string, apiKey: string) {
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

  async getCabinets() {}

  async getCabinet() {}

  async changeCabinet() {}

  async deleteCabinet() {}
}
