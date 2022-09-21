import { LoginDto, RegisterDto } from '../dtos';

export function buildLoginDto(fields: any ): LoginDto {
    const loginDto = new LoginDto();
    loginDto.email = fields.email;
    loginDto.password = fields.password;
    return loginDto;
}

export function buildRegisterDto(fields: any ): RegisterDto {
  const registerDto = new RegisterDto();
  registerDto.username = fields.username;
  registerDto.email = fields.email;
  registerDto.password = fields.password;
  return registerDto;
}
