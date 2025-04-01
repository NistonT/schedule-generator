import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AmountLimitsController } from './amount_limits.controller';
import { AmountLimitsService } from './amount_limits.service';

@Module({
  controllers: [AmountLimitsController],
  providers: [AmountLimitsService, PrismaService],
})
export class AmountLimitsModule {}
