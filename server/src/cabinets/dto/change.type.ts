import { IsString } from 'class-validator';

export class ChangeCabinetDto {
  @IsString()
  oldName: string;

  @IsString()
  newName: string;
}
