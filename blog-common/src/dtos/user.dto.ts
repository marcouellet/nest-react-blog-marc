import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';

import { UserRole } from '../enum';
import { IAuthToken } from '../interfaces/jwt.interface';
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
  role?: UserRole;

  @IsOptional()
  image?: ImageData;

  @IsNotEmpty()
  authtoken?: IAuthToken;

  @IsNotEmpty()
  authrefreshtoken?: IAuthToken;
}

