import { IsString, IsDate, ValidateNested } from '@nestjs/class-validator';
import { UserFindCriterias } from './user.find-criterias';

export class PostFindCriterias {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @ValidateNested()
  userCriterias?: UserFindCriterias;

  @IsDate()
    publishedBefore?: Date;

  @IsDate()
  publishedAfter?: Date;
}