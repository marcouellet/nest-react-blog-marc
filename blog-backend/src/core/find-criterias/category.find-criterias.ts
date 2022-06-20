import { IsString } from '@nestjs/class-validator';

export class CategoryFindCriterias {
  @IsString()
  title?: string;

  @IsString()
  description?: string;
}