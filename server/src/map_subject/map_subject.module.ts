import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { MapSubjectController } from './map_subject.controller';
import { MapSubjectService } from './map_subject.service';

@Module({
  controllers: [MapSubjectController],
  providers: [MapSubjectService, PrismaService, UserService, SubjectService],
})
export class MapSubjectModule {}
