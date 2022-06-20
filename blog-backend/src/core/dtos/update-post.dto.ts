import { IsString, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '../entities/post.entity';

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
    @MinLength(minimumPostBodyLength, {
      message: `Body text must be at least ${minimumPostBodyLength} characters long`,
    })
    body: string;
  }

export interface IUpdatePostCriterias {title: string; description: string; body: string; }
