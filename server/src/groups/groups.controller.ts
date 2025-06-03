import {
  BadRequestException,
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
import { ChangeGroupDto } from './dto/change.type';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /*
    POST /groups?api-key=KEY&schedule_id=ID
    {
      "name": ["ИВТ-2-1", "ИВТ-2-2"]
    }
  */
  @Post()
  public async add(
    @Body() body: { name: string[] },
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    if (!body.hasOwnProperty('name')) {
      throw new BadRequestException('Поле "name" обязательно');
    }

    return await this.groupsService.addGroup(body.name, apiKey, scheduleId);
  }

  /*
    GET /groups?api-key=KEY&schedule_id=ID
  */
  @Get()
  public async get(
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.groupsService.getGroups(apiKey, scheduleId);
  }

  /*
    GET /groups/all?api-key=KEY
  */
  @Get('/all')
  public async getAll(
    @Query('api-key') apiKey: string,
  ): Promise<{ id: string; groups: string[] }[]> {
    return await this.groupsService.getAllGroups(apiKey);
  }

  /*
    PUT /groups?api-key=KEY&schedule_id=ID
    {
      "oldName": "ИВТ-2-1",
      "newName": "ИВТ-2-2"
    }
  */
  @UsePipes(new ValidationPipe())
  @Put()
  public async change(
    @Body() dto: ChangeGroupDto,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    const { oldName, newName } = dto;

    return await this.groupsService.changeGroup(
      oldName,
      newName,
      apiKey,
      scheduleId,
    );
  }

  /*
    DELETE /groups?api-key=KEY&schedule_id=ID
    {
      "name": "ИВТ-2-1"
    }
  */
  @Delete()
  public async delete(
    @Body('name') name: string,
    @Query('api-key') apiKey: string,
    @Query('schedule_id') scheduleId: string,
  ): Promise<string[]> {
    return await this.groupsService.deleteGroup(name, apiKey, scheduleId);
  }
}
