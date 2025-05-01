import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Subject } from '@prisma/client';
import { AddSubjectDto } from './dto/subject.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  public async add(dto: AddSubjectDto): Promise<Subject> {
    return await this.subjectService.add(dto);
  }

  @Get()
  public async getId(@Query('id') id: number): Promise<Subject> {
    return await this.subjectService.getId(id);
  }

  @Get()
  public async getAll(): Promise<Subject[]> {
    return await this.subjectService.getAll();
  }

  @Delete()
  public async delete(@Query('id') id: number): Promise<Subject> {
    return await this.subjectService.delete(id);
  }
}
