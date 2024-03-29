import { IsString, IsNotEmpty, MinLength, ValidateNested, IsOptional } from 'class-validator';

import { Category } from '../entities';
import { CategoryDto } from '../dtos';
import { minimumPostTitleLength, minimumPostDescriptionLength } from '../entities/post.entity';
import { ImageData } from'../interfaces';

export class UpdatePostDto {
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
    body: string;

    @IsOptional()
    @ValidateNested()
    category?: CategoryDto;

    @IsOptional()
    image?: ImageData;
  }

export interface IUpdatePostCriterias {category: Category, title: string; description: string; body: string; image: ImageData}
