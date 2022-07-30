import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { IAuthToken } from '../../auth/interfaces/jwt.interface';

export class SessionExtensionDto {
  @IsNotEmpty()
  @IsNumber()
  extension: number;

}
