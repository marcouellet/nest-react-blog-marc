import { IsString, IsNotEmpty, IsEmail, IsEnum } from '@nestjs/class-validator';
import { UserRole } from '../enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: string;
}
