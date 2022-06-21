import { IsString, IsNotEmpty, IsEmail, MinLength } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '../entities/user.entity';

export class RegisterDto {
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
}

