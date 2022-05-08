import { IsString, IsNotEmpty, IsDate } from 'class-validator';
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
  user: UserDto;

  @IsDate()
  publishDate: Date;
}
