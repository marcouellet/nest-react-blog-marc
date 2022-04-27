import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { CreateUserDto, UpdateUserDto } from '../../core/dtos';

@Injectable()
export class UserFactoryService {
  createNewUser(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    return newUser;
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const newUser = new User();
    newUser.firstName = updateUserDto.firstName;
    newUser.lastName = updateUserDto.lastName;

    return newUser;
  }
}
