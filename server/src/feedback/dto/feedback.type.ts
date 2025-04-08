import { IsEmpty, IsString } from 'class-validator';

export class AddFeedbackDto {
  @IsString({
    message: 'Введите название обращение',
  })
  title: string;

  @IsString({
    message: 'Введите текс',
  })
  text: string;
}

export class ChangeFeedbackDto {
  @IsString()
  @IsEmpty()
  title?: string;

  @IsString()
  @IsEmpty()
  text?: string;

  @IsString()
  @IsEmpty()
  feedback_admin?: string;

  @IsString()
  @IsEmpty()
  admin?: string;

  @IsString()
  @IsEmpty()
  isCheck?: boolean;
}
