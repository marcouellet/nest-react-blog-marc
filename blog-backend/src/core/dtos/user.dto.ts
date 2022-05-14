import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { UserRole } from '../enum'
import { IAuthToken } from '../../auth/interfaces/auth-token.interface'
export class UserDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  role?: UserRole;

  @IsNotEmpty()
  authtoken?: IAuthToken;

  @IsDate()
  createdOn?: Date;
}

