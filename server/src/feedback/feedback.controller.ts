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
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentUser } from 'src/auth/decorators/user.decorators';
import {
  AddFeedbackDto,
  AdminFeedbackDto,
  ChangeFeedbackDto,
} from './dto/feedback.type';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Добавить обращение
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  public async add(@Body() dto: AddFeedbackDto, @CurrentUser('id') id: string) {
    return await this.feedbackService.add(dto, id);
  }

  @UsePipes(new ValidationPipe())
  @Post('/admin')
  public async feedbackAdmin(
    @Body() dto: AdminFeedbackDto,
    @Query('feedback_id') feedback_id: string,
  ) {
    return await this.feedbackService.feedback_admin(dto, feedback_id);
  }

  @Get('/id')
  public async getId(@Query('feedback_id') feedback_id: string) {
    return await this.feedbackService.getId(feedback_id);
  }

  // Вывести все обращение пользователя
  @Get()
  public async get(@Query('user_id') user_id: string) {
    return await this.feedbackService.get(user_id);
  }

  // Вывод всех обращений
  @Get('/all')
  public async getAll() {
    return await this.feedbackService.getAll();
  }

  // Изменить обращение
  @Put()
  public async put(
    @Body() dto: ChangeFeedbackDto,
    @Query('feedback_id') feedback_id: string,
  ) {
    return await this.feedbackService.put(dto, feedback_id);
  }

  // Удалить обращение
  @Delete()
  public async delete(@Query('feedback_id') feedback_id: string) {
    return this.feedbackService.delete(feedback_id);
  }
}
