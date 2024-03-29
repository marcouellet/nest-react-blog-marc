import { Logger } from '@nestjs/common';

import { UserDto } from 'shared/dtos';
import { UserService } from 'services/user/user.service';
import { AuthService } from 'services/auth.service';
import { buildRegisterDto  } from 'shared/builders/auth.dtos.builders';

export class AuthDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      for (const user of users) {
        if (user.email.startsWith('e2e.auth.')) {
          Logger.debug(`AUTH: deleting user with email "${user.email}"`)
          Logger.flush();
          await this.userService.deleteUser(user.id)
          .then(user => {
            Logger.debug(`AUTH: user with email "${user.email}" has been deleted`)
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`AUTH: user with email "${user.email}" deletion failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
     } catch (error) {
      Logger.error('AUTH: deleteAllE2EUsers failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  }

  async registerUser(registerData: any): Promise<UserDto> {
    const registerDto = buildRegisterDto(registerData);
    return this.authService.register(registerDto);
  }

  async registerUserAsAdmin(registerData: any): Promise<UserDto> {
    const registerDto = buildRegisterDto(registerData);
    return this.authService.registerAsAdmin(registerDto);
  }

  removeTokensFromUserDto(userDto: UserDto): UserDto {
    const dto = { ... userDto };
    delete dto.authtoken;
    delete dto.authrefreshtoken;
    return dto;
  }
}
