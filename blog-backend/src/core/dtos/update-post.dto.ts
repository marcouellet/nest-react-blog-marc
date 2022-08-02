import { IsString, IsNotEmpty, MinLength, ValidateNested, IsOptional } from '@nestjs/class-validator';

import { Category } from '../../core/entities';
import { CategoryDto } from '../dtos';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '../entities/post.entity';
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

    @ValidateNested()
    category: CategoryDto;

    @IsOptional()
    image: ImageData;
  }

export interface IUpdatePostCriterias {category: Category, title: string; description: string; body: string; image: ImageData}
