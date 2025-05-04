import { Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(readonly prisma: PrismaService) {}

  public async add(dto: AddSubjectDto): Promise<Subject> {
    console.log(dto);

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
        id: Number(id),
      },
    });

    return getIdSubject;
  }

  public async getAll(mapSubjectId: number): Promise<Subject[]> {
    const getAllSubject = await this.prisma.subject.findMany({
      where: {
        mapSubject_id: Number(mapSubjectId),
      },
    });

    return getAllSubject;
  }

  public async delete(id: number): Promise<Subject> {
    const deleteSubject = await this.prisma.subject.delete({
      where: {
        id: Number(id),
      },
    });

    return deleteSubject;
  }
}
