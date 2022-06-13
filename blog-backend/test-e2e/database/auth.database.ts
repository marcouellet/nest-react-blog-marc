import { Logger } from '@nestjs/common';
import { UserDto } from '../../src/core/dtos';
import { buildLoginDto, buildRegisterDto  } from '../../test/validations/dtos/builders/auth.dtos.builders';
import { UserService } from '../../src/services/user/user.service';
import { AuthService } from '../../src/services/auth.service';

export class AuthDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(user => {
        try {
          if (user.username.startsWith('e2e.auth.')) {
            this.userService.deleteUser(user.id);
          }
        } catch (error) {
          Logger.error(error);
        }
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  async loginUser(loginData: any): Promise<UserDto> | null {
    const loginrDto = buildLoginDto(loginData);
    return this.authService.login(loginrDto);
  }

  async registerUser(registerData: any): Promise<UserDto> | null {
    const registerDto = buildRegisterDto(registerData);
    return this.authService.register(registerDto);
  }
}
