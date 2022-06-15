import { Logger } from '@nestjs/common';
import { UserDto } from '../../src/core/dtos';
import { buildRegisterDto  } from '../../test/builders/auth.dtos.builders';
import { UserService } from '../../src/services/user/user.service';
import { AuthService } from '../../src/services/auth.service';

export class AuthDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(user => {
        try {
          if (user.email.startsWith('e2e.auth.')) {
            this.userService.deleteUser(user.id);
          }
        } catch (error) {
          Logger.warn('AUTH: deleteAllE2EUsers delete failed, see following error message:')
          Logger.error(error);
        }
      });
    } catch (error) {
      Logger.warn('AUTH: deleteAllE2EUsers getAllUsers failed, see following error message:')
      Logger.error(error);
    }
  }

  async registerUser(registerData: any): Promise<UserDto> {
    const registerDto = buildRegisterDto(registerData);
    return this.authService.register(registerDto);
  }
}
