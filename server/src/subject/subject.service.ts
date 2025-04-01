import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async add(name: string, id_map_subject: number) {
    return await this.prisma.subject.create({
      data: {
        name: name,
        mapSubject_id: id_map_subject,
      },
    });
  }

  async get() {}

  async pull() {}

  async delete() {}
}
