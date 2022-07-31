import { IsString, IsNotEmpty, MinLength } from '@nestjs/class-validator';

import { minimumCategoryTitleLength, minimumCategoryDescriptionLength } from '../entities/category.entity';

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(minimumCategoryTitleLength, {
      message: `Title text must be at least ${minimumCategoryTitleLength} characters long`,
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumCategoryDescriptionLength, {
      message: `Description text must be at least ${minimumCategoryDescriptionLength} characters long`,
    })
    description: string;
}

export interface IUpdateCategoryCriterias {title: string; description: string; }
