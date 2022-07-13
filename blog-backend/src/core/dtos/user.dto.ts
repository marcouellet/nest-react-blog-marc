import { IsString, IsNotEmpty, IsDate, IsEmail, IsEnum } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { UserRole } from '../enum';
import { IAuthToken } from '../../auth/interfaces/jwt.interface';
import { Optional } from '@nestjs/common';
import { ImageData } from'../interfaces';
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

  @Optional()
  image?: ImageData;

  @IsNotEmpty()
  @Type(() => IAuthToken)
  authtoken?: IAuthToken;

  @IsNotEmpty()
  @Type(() => IAuthToken)
  authrefreshtoken?: IAuthToken;
}

