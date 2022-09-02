import { IsString } from 'class-validator';

export class CategoryFindCriterias {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}