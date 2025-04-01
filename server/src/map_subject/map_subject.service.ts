import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MapSubjectService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private subjectService: SubjectService,
  ) {}

  async add(name_group: string) {
    const mapSubject = await this.prisma.mapSubject.create({
      data: {
        name_group,
      },
    });

    return mapSubject;
  }

  async get(api_key: string, name: string) {
    const user = await this.userService.getByApiKey(api_key);
    const schedule = await this.prisma.schedule.findFirst({
      where: {
        user_id: user.id,
      },
      select: {
        mapSubject: true,
      },
    });

    return await this.prisma.mapSubject.findFirst({
      where: {
        name_group: name,
      },
    });
  }

  async pull() {}

  async delete() {}
}
