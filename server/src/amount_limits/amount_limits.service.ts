import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AmountLimitsService {
  constructor(private prisma: PrismaService) {}

  async add() {}

  async get() {}

  async pull() {}

  async delete() {}
}
