import { IsString, IsNotEmpty, IsDate, ValidateNested } from '@nestjs/class-validator';
import { UserDto } from './user.dto';
import { CategoryDto } from './category.dto';

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

  @IsNotEmpty()
  @ValidateNested()
  user: UserDto;

  @IsDate()
  publishDate?: Date;
}
