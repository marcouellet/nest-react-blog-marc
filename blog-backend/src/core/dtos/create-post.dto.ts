import { IsString, IsNotEmpty, ValidateNested } from '@nestjs/class-validator';
import { UserDto } from './user.dto';

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
    @ValidateNested()
    user: UserDto;
  }
