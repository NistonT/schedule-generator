import { IsNumber, IsString } from 'class-validator';

export class ChangeTeachersDto {
  @IsNumber()
  teacherId: number;

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
