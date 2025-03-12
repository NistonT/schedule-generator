import { IsString } from 'class-validator';

export class ChangeTeachersDto {
  @IsString()
  oldName: string;

  @IsString()
  newName: string;
}

export interface ITeachers {
  teachers: ITeacher[];
}

interface ITeacher {
  tid: number;
  name: string;
}
