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
import { ChangeGroupsDto, Groups } from './dto/groups.types';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async add(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
  ): Promise<Schedule> {
    return await this.groupsService.add(name, apiKey);
  }

  @Get()
  async get(@Query('api-key') apiKey: string): Promise<Groups[]> {
    return await this.groupsService.get(apiKey);
  }

  @UsePipes(new ValidationPipe())
  @Put()
  async change(
    @Body() dto: ChangeGroupsDto,
    @Query('api-key') apiKey: string,
  ): Promise<Schedule> {
    const { oldName, newName } = dto;
    return await this.groupsService.change(oldName, newName, apiKey);
  }

  @Delete()
  async delete(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
  ): Promise<Schedule> {
    return await this.groupsService.delete(name, apiKey);
  }
}
