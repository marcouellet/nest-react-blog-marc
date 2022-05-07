import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
  userId: any;

  @IsDate()
  publishDate: Date;
}

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
  userId: any;

  @IsDate()
  publishDate: Date;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

