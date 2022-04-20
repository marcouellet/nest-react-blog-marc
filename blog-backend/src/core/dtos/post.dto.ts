import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePostDto {
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
  authorId: any;

  @IsDate()
  publishDate: Date;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

