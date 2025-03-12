import { IsString } from 'class-validator';
export class ChangeGroupsDto {
  @IsString()
  oldName: string;

  @IsString()
  newName: string;
}

export interface Groups {
  groups: string[];
}
