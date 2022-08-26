import { IsString, IsNotEmpty, IsOptional, ValidateNested, MinLength } from 'class-validator';

import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '../entities/post.entity';
import { ImageData } from'../interfaces';
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

    @IsOptional()
    image: ImageData;

    @IsNotEmpty()
    @ValidateNested()
    user: UserDto;
  }
