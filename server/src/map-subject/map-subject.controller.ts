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
import { MapSubject } from '@prisma/client';
import { AddMapSubjectDto } from './dto/map-subject.dto';
import { MapSubjectService } from './map-subject.service';

@Controller('map-subject')
export class MapSubjectController {
  constructor(private readonly mapSubjectService: MapSubjectService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  public async add(@Body() dto: AddMapSubjectDto): Promise<MapSubject> {
    return await this.mapSubjectService.add(dto);
  }

  @Get()
  public async getId(@Query('id') id: number): Promise<MapSubject> {
    return await this.mapSubjectService.getId(id);
  }

  @Get()
  public async getAll(): Promise<MapSubject[]> {
    return await this.mapSubjectService.getAll();
  }

  @Delete()
  public async delete(@Query('id') id: number): Promise<MapSubject> {
    return await this.mapSubjectService.delete(id);
  }
}
