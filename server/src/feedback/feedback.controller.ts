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
  async add(@Body() dto: AddFeedbackDto, @Query('user_id') user_id: string) {
    return await this.feedbackService.add(dto, user_id);
  }

  @UsePipes(new ValidationPipe())
  @Post('/admin')
  async feedbackAdmin(
    @Body() dto: AdminFeedbackDto,
    @Query('feedback_id') feedback_id: string,
  ) {
    return await this.feedbackService.feedback_admin(dto, feedback_id);
  }

  @Get('/id')
  async getId(@Query('feedback_id') feedback_id: string) {
    return await this.feedbackService.getId(feedback_id);
  }

  // Вывести все обращение пользователя
  @Get()
  async get(@Query('user_id') user_id: string) {
    return await this.feedbackService.get(user_id);
  }

  // Вывод всех обращений
  @Get('/all')
  async getAll() {
    return await this.feedbackService.getAll();
  }

  // Изменить обращение
  @Put()
  async put(
    @Body() dto: ChangeFeedbackDto,
    @Query('feedback_id') feedback_id: string,
  ) {
    return await this.feedbackService.put(dto, feedback_id);
  }

  // Удалить обращение
  @Delete()
  async delete(@Query('feedback_id') feedback_id: string) {
    return this.feedbackService.delete(feedback_id);
  }
}
