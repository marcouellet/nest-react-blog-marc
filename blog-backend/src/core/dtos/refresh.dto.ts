import { IsNotEmpty } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { IAuthToken } from '../../auth/interfaces/auth-token.interface';

export class RefreshDto {
  @IsNotEmpty()
  @Type(() => IAuthToken)
  authtoken: IAuthToken;
  @IsNotEmpty()
  @Type(() => IAuthToken)
  authrefreshtoken: IAuthToken;
}
