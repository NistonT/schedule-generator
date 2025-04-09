import { IsBoolean, IsEmpty, IsString } from 'class-validator';

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

export class AdminFeedbackDto {
  @IsString()
  feedback_admin: string;

  @IsBoolean()
  isCheck: boolean;

  @IsString()
  admin: string;
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
