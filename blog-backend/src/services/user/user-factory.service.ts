import { Injectable } from '@nestjs/common';

import { User } from '../../core/entities';
import { UserDto, IUpdateUserCriterias, UpdateUserDto } from '../../core/dtos';
import { IDataRepositories } from '../../core/repositories';
@Injectable()
export class UserFactoryService {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories) {}

  createUser(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    user.role = userDto.role;
    user.image = userDto.image;

    return this.dataServicesRepositories.users.convertFromGenericEntity(user);
  }

  updateUser(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    user.role = userDto.role;
    user.image = userDto.image;

    return this.dataServicesRepositories.users.convertFromGenericEntity(user);
  }

  createUserDto(user: User): UserDto {
    const newUser = this.dataServicesRepositories.users.convertToGenericEntity(user);
    const userDto = new UserDto();
    userDto.id = newUser.id;
    userDto.email = newUser.email;
    userDto.username = newUser.username;
    userDto.password = newUser.password;
    userDto.role = newUser.role;
    userDto.image = newUser.image;

    return userDto;
  }

  // Make sure only desired criterias are selected from the incomming object
  createUpdateUserCriterias(updateUserDto: UpdateUserDto): IUpdateUserCriterias {
    const {username, email, password, role, image} = updateUserDto;
    return {username, email, password, role, image} as IUpdateUserCriterias;
  }

  removeRestrictedProperties(user: UserDto): UserDto { delete user.password; return user; }
}
