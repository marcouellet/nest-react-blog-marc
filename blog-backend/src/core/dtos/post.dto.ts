import { IsString, IsNotEmpty, IsDate, ValidateNested } from '@nestjs/class-validator';
import { UserDto } from './user.dto';

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

  @IsNotEmpty()
  @ValidateNested()
  user: UserDto;

  @IsDate()
  publishDate?: Date;
}
