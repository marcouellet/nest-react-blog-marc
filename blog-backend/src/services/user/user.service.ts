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
    return this.dataServicesRepositories.users.getAll();
  }

  getUserById(id: any): Promise<User> {
    return this.dataServicesRepositories.users.get(id);
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const author = this.userFactoryService.createNewUser(createUserDto);
    return this.dataServicesRepositories.users.create(author);
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = this.userFactoryService.updateUser(updateUserDto);
    return this.dataServicesRepositories.users.update(userId, user);
  }

  deleteUser(id: any) : Promise<User>
  {
    return this.dataServicesRepositories.users.delete(id);
  }
}
