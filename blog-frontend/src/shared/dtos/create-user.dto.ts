import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, MinLength } from 'class-validator';

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
    role: UserRole;

    @IsOptional()
    image?: ImageData;
}
