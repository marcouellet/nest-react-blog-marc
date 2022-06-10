import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    body: string;
  }

export interface IUpdatePostCriterias {title: string; description: string; body: string; }
