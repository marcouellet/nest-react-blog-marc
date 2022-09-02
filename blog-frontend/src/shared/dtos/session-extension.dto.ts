import { IsNotEmpty, IsNumber } from 'class-validator';

export class SessionExtensionDto {
  @IsNotEmpty()
  @IsNumber()
  extension: number;
}
