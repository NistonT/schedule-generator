import {
  Body,
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
  public async add(@Body() dto: AddSubjectDto): Promise<Subject> {
    console.log(dto);
    return await this.subjectService.add(dto);
  }

  @Get()
  public async getId(@Query('id') id: number): Promise<Subject> {
    return await this.subjectService.getId(id);
  }

  @Get('all')
  public async getAll(
    @Query('mapSubject_id') mapSubjectId: number,
  ): Promise<Subject[]> {
    return await this.subjectService.getAll(mapSubjectId);
  }

  @Delete()
  public async delete(@Query('id') id: number): Promise<Subject> {
    return await this.subjectService.delete(id);
  }
}
