import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { CreateUserDto as CreateUserDto, UpdateUserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserService {

  constructor(
    private dataServicesRepositories: IDataServicesRepositories,
    private userFactoryService: UserFactoryService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.dataServicesRepositories.users.convertToGenericId(user)));
  }

  getUserById(id: any): Promise<User> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.dataServicesRepositories.users.convertToGenericId(user));
  }

  findUser(criterias: any): Promise<User> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.dataServicesRepositories.users.convertToGenericId(user));
  }

  findManyUsers(criterias: any): Promise<User[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.dataServicesRepositories.users.convertToGenericId(user)));
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userFactoryService.createNewUser(createUserDto);
    return this.dataServicesRepositories.users.create(user)
      .then(user => this.dataServicesRepositories.users.convertToGenericId(user));
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = this.userFactoryService.updateUser(updateUserDto);
    return this.dataServicesRepositories.users.update(userId, user)
      .then(user => this.dataServicesRepositories.users.convertToGenericId(user));
  }

  deleteUser(id: any): Promise<User>
  {
    return this.dataServicesRepositories.users.delete(id);
  }
}
