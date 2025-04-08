import { Controller } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  async add() {}

  async get() {}

  async getAll() {}

  async put() {}

  async delete() {}
}
