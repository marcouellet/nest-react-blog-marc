import { UserDto } from '../../src/core/dtos';
import { buildLoginDto, buildRegisterDto  } from '../../test/validations/dtos/builders/auth.dtos.builders';
import { AuthService } from '../../src/services/auth.service';

export class AuthDatabaseBuilder {
  constructor(private readonly authService: AuthService) {}

  async loginUser(loginData: any): Promise<UserDto> | null {
    const loginrDto = buildLoginDto(loginData);
    return this.authService.login(loginrDto);
  }

  async registerUser(registerData: any): Promise<UserDto> | null {
    const registerDto = buildRegisterDto(registerData);
    return this.authService.register(registerDto);
  }
}
