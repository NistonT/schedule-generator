import { BadRequestException, Injectable } from '@nestjs/common';
import { MapSubject } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddMapSubjectDto } from './dto/map-subject.dto';

@Injectable()
export class MapSubjectService {
  constructor(private prisma: PrismaService) {}

  public async add(dto: AddMapSubjectDto): Promise<MapSubject> {
    const createMapSubject = await this.prisma.mapSubject.create({
      data: {
        name_group: dto.name_group,
        scheduleId: dto.scheduleId,
      },
      include: {
        subjects: true,
      },
    });

    return createMapSubject;
  }

  public async getId(id: number): Promise<MapSubject> {
    if (!id) throw new BadRequestException('Идентификатор не найден');

    const getIdMapSubject = await this.prisma.mapSubject.findUnique({
      where: {
        id: Number(id),
      },
    });

    return getIdMapSubject;
  }

  public async getAll(scheduleId: string): Promise<MapSubject[]> {
    const getAllMapSubject = await this.prisma.mapSubject.findMany({
      where: { scheduleId: scheduleId },
    });

    return getAllMapSubject;
  }

  public async delete(id: number): Promise<MapSubject> {
    const deleteMapSubject = await this.prisma.mapSubject.delete({
      where: {
        id: Number(id),
      },
    });

    return deleteMapSubject;
  }
}
