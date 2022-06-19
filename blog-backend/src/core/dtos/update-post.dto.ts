import { IsString, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { minimumTitleLength, minimumDescriptionLength, minimumBodyLength } from '../entities/post.entity';

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(minimumTitleLength, {
      message: `Title text must be at least ${minimumTitleLength} characters long`,
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumDescriptionLength, {
      message: `Description text must be at least ${minimumDescriptionLength} characters long`,
    })
    description: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumBodyLength, {
      message: `Body text must be at least ${minimumBodyLength} characters long`,
    })
    body: string;
  }

export interface IUpdatePostCriterias {title: string; description: string; body: string; }
