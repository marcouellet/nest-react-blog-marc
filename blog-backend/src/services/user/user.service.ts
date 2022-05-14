import { Injectable } from '@nestjs/common';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserService {

  constructor(
    private readonly dataServicesRepositories: IDataServicesRepositories,
    private readonly userFactoryService: UserFactoryService,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)));
  }

  async getUserById(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async findUser(criterias: {}): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async findManyUsers(criterias: {}): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)));
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const newUser = this.userFactoryService.createUser(userDto);
    return this.dataServicesRepositories.users.create(newUser)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async updateUser(id: string, userDto: UserDto): Promise<UserDto> {
    const updatedUser = this.userFactoryService.updateUser(userDto);
    return this.dataServicesRepositories.users.update(id, updatedUser)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async deleteUser(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.delete(id)
      .then(user => this.userFactoryService.createUserDto(user));
  }
}
