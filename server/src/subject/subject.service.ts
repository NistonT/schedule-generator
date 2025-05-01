import { Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(readonly prisma: PrismaService) {}

  public async add(dto: AddSubjectDto): Promise<Subject> {
    const addSubject = await this.prisma.subject.create({
      data: {
        name: dto.name,
        mapSubject_id: dto.mapSubject_id,
      },
    });

    return addSubject;
  }

  public async getId(id: number): Promise<Subject> {
    const getIdSubject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    });

    return getIdSubject;
  }

  public async getAll(): Promise<Subject[]> {
    const getAllSubject = await this.prisma.subject.findMany();

    return getAllSubject;
  }

  public async delete(id: number): Promise<Subject> {
    const deleteSubject = await this.prisma.subject.delete({
      where: {
        id,
      },
    });

    return deleteSubject;
  }
}
