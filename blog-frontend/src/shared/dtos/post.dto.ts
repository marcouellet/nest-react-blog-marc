import { IsString, IsNotEmpty, IsDate, ValidateNested, IsOptional } from 'class-validator';

import { UserDto } from './user.dto';
import { CategoryDto } from './category.dto';
import { ImageData } from '../interfaces';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @ValidateNested()
  category?: CategoryDto;

  @IsOptional()
  image?: ImageData;

  @IsNotEmpty()
  @ValidateNested()
  user: UserDto;

  @IsDate()
  publishDate?: Date;
}
