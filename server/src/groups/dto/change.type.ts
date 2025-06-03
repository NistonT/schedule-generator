import { IsString } from 'class-validator';

export class ChangeGroupDto {
  @IsString()
  oldName: string;

  @IsString()
  newName: string;
}
