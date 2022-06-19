import { IsString, IsNotEmpty, IsEmail, MinLength } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../entities/user.entity';

export class RegisterDto {
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
  password: string;
}

