import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';
import { CryptographerService } from '../cryptographer.service';

@Injectable()
export class UserService {

  constructor(
    private readonly dataServicesRepositories: IDataServicesRepositories,
    private readonly userFactoryService: UserFactoryService,
    private readonly cryptoService: CryptographerService
  ) {}

  getAllUsers(): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)))
  }

  getUserById(id: any): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  findUser(criterias: any): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  findManyUsers(criterias: any): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)));
  }

  createUser(userDto: UserDto): Promise<UserDto> {
    const newUser = this.userFactoryService.createUser(userDto);
    return this.dataServicesRepositories.users.create(newUser)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  updateUser(userDto: UserDto): Promise<UserDto> {
    const updatedUser = this.userFactoryService.updateUser(userDto);
    return this.dataServicesRepositories.users.update(updatedUser.id, updatedUser)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  deleteUser(id: any): Promise<User> {
    return this.dataServicesRepositories.users.delete(id);
  }
}
