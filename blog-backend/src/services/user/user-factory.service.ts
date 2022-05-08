import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { UserDto } from '../../core/dtos';

@Injectable()
export class UserFactoryService {
  createUser(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;

    return user;
  }

  updateUser(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;

    return user;
  }
  
  createUserDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.email = user.email;
    userDto.username = user.username;

    return userDto;
  }
}
