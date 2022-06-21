import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
