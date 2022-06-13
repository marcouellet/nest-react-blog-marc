import { UserDto } from '../../src/core/dtos';
import { UserService } from '../../src/services/user/user.service';
import { UserCriterias } from '../../src/core';
import { buildCreateUserDto, buildUpdateUserDto } from '../../test/validations/dtos/builders/user.dtos.builders';

export class UserDatabaseBuilder {
  constructor(private readonly userService: UserService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(user => {
        try {
          if (user.username.startsWith('e2e')) {
            this.userService.deleteUser(user.id);
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findUser(userCriterias: UserCriterias): Promise<UserDto> | null {
    return this.userService.findUser(userCriterias); 
  }

  async createUser(createUserData: any): Promise<UserDto> {
    const createUserDto = buildCreateUserDto(createUserData);
    return this.userService.createUser(createUserDto); 
  }

  async updateUser(id: string, updateUserData: any): Promise<UserDto> {
    const updateUserDto = buildUpdateUserDto(updateUserData);
    return this.userService.updateUser(id, updateUserDto); 
  }

  async deleteUser(id: string): Promise<UserDto> {
    return this.userService.deleteUser(id); 
  }
}
