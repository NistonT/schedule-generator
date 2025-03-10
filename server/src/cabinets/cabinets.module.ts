import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { CabinetsController } from './cabinets.controller';
import { CabinetsService } from './cabinets.service';

@Module({
  controllers: [CabinetsController],
  providers: [CabinetsService, UserService, PrismaService],
})
export class CabinetsModule {}
