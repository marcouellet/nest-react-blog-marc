import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { UserDto } from '../../core/dtos';
import { IDataRepositories } from '../../core/abstracts';
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
    user.createdOn = new Date();

    return this.dataServicesRepositories.users.convertFromGenericEntity(user);
  }

  updateUser(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    user.role = userDto.role;
    
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
    userDto.createdOn = newUser.createdOn;

    return userDto;
  }

  removeRestrictedProperties (user: UserDto): UserDto { delete user.password; return user; }
}
