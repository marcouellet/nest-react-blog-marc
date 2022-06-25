import { IsString, IsNotEmpty, ValidateNested, MinLength } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength, IPostImage } from '../entities/post.entity';
import { CategoryDto } from './category.dto';
import { UserDto } from './user.dto';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(minimumPostTitleLength, {
      message: `Title text must be at least ${minimumPostTitleLength} characters long`,
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumPostDescriptionLength, {
      message: `Description text must be at least ${minimumPostDescriptionLength} characters long`,
    })
    description: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumPostBodyLength, {
      message: `Body text must be at least ${minimumPostBodyLength} characters long`,
    })
    body: string;

    @ValidateNested()
    category: CategoryDto;

    @Optional()
    image: IPostImage;

    @IsNotEmpty()
    @ValidateNested()
    user: UserDto;
  }
