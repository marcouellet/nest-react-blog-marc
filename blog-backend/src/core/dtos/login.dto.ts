import { IsString, IsNotEmpty, IsEmail, MinLength } from '@nestjs/class-validator';
import { minimumEmailLength, minimumPasswordLength } from '../entities/user.entity';
export class LoginDto {
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



