import { IsString, IsDate, ValidateNested } from '@nestjs/class-validator';
import { UserCriterias } from './user.criterias';

export class PostCriterias {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @ValidateNested()
  userCriterias?: UserCriterias;

  @IsDate()
    publishedBefore?: Date;

  @IsDate()
  publishedAfter?: Date;
}