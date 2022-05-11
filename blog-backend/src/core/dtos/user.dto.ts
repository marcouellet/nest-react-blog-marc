import { IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enum'
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
}
