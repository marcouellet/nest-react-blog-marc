import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';

export class SessionExtensionDto {
  @IsNotEmpty()
  @IsNumber()
  extension: number;
}
