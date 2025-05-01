import { IsNumber, IsString } from 'class-validator';

export class AddSubjectDto {
  @IsString()
  name: string;

  @IsNumber()
  mapSubject_id: number;
}
