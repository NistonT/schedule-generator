import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, PrismaService],
  exports: [SubjectService],
})
export class SubjectModule {}
