import { IsString, IsNotEmpty, IsEmail, IsEnum, MinLength } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../entities/user.entity';
import { UserRole } from '../enum';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(minimumUserNameLength, {
      message: `User name must be at least ${minimumUserNameLength} characters long`,
      })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(minimumEmailLength, {
      message: `Email must be at least ${minimumEmailLength} characters long`,
      })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumPasswordLength, {
      message: `Password text must be at least ${minimumPasswordLength} characters long`,
      })
    password?: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role?: string;
}

export interface IUpdateUserCriterias {username: string; email: string; password: string;  role: string; }
