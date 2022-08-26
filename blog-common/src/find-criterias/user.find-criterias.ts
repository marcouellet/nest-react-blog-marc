import { IsString, IsDate, IsEmail, IsEnum } from 'class-validator';

import { UserRole } from '../enum';

export class UserFindCriterias {
    @IsString()
    username?: string;

    @IsEmail()
    email?: string;

    @IsString()
    password?: string;

    @IsEnum(UserRole)
    role?: UserRole;

    @IsDate()
    createdBefore?: Date;

    @IsDate()
    createdAfter?: Date;
  }
