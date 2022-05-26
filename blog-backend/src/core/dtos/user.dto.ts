import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { UserRole } from '../enum';
import { IAuthToken } from '../../auth/interfaces/jwt.interface';
export class UserDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

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

  @IsNotEmpty()
  @Type(() => IAuthToken)
  authtoken?: IAuthToken;

  @IsNotEmpty()
  @Type(() => IAuthToken)
  authrefreshtoken?: IAuthToken;

  @IsDate()
  createdOn?: Date;
}

