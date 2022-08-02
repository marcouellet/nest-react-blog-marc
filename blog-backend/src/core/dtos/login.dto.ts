import { IsString, IsNotEmpty, IsEmail, MinLength } from '@nestjs/class-validator';

import { minimumUserEmailLength, minimumUserPasswordLength } from '../entities/user.entity';
export class LoginDto {
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



