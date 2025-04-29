import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { ChangeGroupsDto } from './dto/groups.types';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  public async add(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<Schedule> {
    return await this.groupsService.add(name, apiKey, scheduleId);
  }

  @Get()
  public async get(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.groupsService.get(apiKey, scheduleId);
  }

  @Get('/all')
  public async getAll(
    @Query('api-key') apiKey: string,
  ): Promise<{ id: string; groups: string[] }[]> {
    return await this.groupsService.getAll(apiKey);
  }

  @UsePipes(new ValidationPipe())
  @Put()
  public async change(
    @Body() dto: ChangeGroupsDto,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<Schedule> {
    const { oldName, newName } = dto;
    return await this.groupsService.change(
      oldName,
      newName,
      apiKey,
      scheduleId,
    );
  }

  @Delete()
  public async delete(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<Schedule> {
    return await this.groupsService.delete(name, apiKey, scheduleId);
  }
}
