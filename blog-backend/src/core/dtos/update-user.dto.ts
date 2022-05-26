import { IsString, IsNotEmpty, IsEmail, IsEnum } from '@nestjs/class-validator';
import { UserRole } from '../enum';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role?: string;
}

export interface IUpdateUserCriterias {username: string; email: string; password: string;  role: string; }
