import { IsString, IsNotEmpty, IsEmail, IsEnum, MinLength } from '@nestjs/class-validator';
import { Optional } from '@nestjs/common';

import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '../entities/user.entity';
import { UserRole } from '../enum';
import { ImageData } from'../interfaces';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(minimumUserNameLength, {
        message: `User name must be at least ${minimumUserNameLength} characters long`,
      })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(minimumUserEmailLength, {
      message: `Email must be at least ${minimumUserEmailLength} characters long`,
      })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(minimumUserPasswordLength, {
      message: `Password text must be at least ${minimumUserPasswordLength} characters long`,
      })
    password: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: string;

    @Optional()
    image?: ImageData;
}
