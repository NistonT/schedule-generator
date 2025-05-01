import { IsString } from 'class-validator';

export class AddMapSubjectDto {
  @IsString()
  name_group: string;

  @IsString()
  scheduleId: string;
}
