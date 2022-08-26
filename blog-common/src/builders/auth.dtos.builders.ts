import { LoginDto, RegisterDto } from '../dtos';

export function buildLoginDto(fields: any ): LoginDto {
    const logintDto = new LoginDto();
    logintDto.email = fields.email;
    logintDto.password = fields.password;
    return logintDto;
}

export function buildRegisterDto(fields: any ): RegisterDto {
  const registerDto = new RegisterDto();
  registerDto.username = fields.username;
  registerDto.email = fields.email;
  registerDto.password = fields.password;
  return registerDto;
}
