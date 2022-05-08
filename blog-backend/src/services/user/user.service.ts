import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserService {

  constructor(
    private dataServicesRepositories: IDataServicesRepositories,
    private userFactoryService: UserFactoryService,
  ) {}

  createUserDto(user: User): UserDto {
    return this.userFactoryService.createUserDto(this.dataServicesRepositories.users.convertToGenericId(user));
  }

  getAllUsers(): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.createUserDto(user)))
  }

  getUserById(id: any): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.createUserDto(user));
  }

  findUser(criterias: any): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.createUserDto(user));
  }

  findManyUsers(criterias: any): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.createUserDto(user)));
  }

  createUser(userDto: UserDto): Promise<UserDto> {
    const user = this.userFactoryService.createUser(userDto);
    return this.dataServicesRepositories.users.create(user)
      .then(user => this.createUserDto(user));
  }

  updateUser(userDto:UserDto): Promise<UserDto> {
    const user = this.userFactoryService.updateUser(userDto);
    return this.dataServicesRepositories.users.update(user.id, user)
      .then(user => this.createUserDto(user));
  }

  deleteUser(id: any): Promise<User>
  {
    return this.dataServicesRepositories.users.delete(id);
  }
}
