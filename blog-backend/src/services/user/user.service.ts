import { Injectable } from '@nestjs/common';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';
import { CryptographerService } from '../../services/cryptographer.service';

@Injectable()
export class UserService {

  constructor(
    private readonly dataServicesRepositories: IDataServicesRepositories,
    private readonly userFactoryService: UserFactoryService,
    private readonly cryptoService: CryptographerService
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)))
      .then(users => users.map(user => this.userFactoryService.removeRestrictedProperties(user)));
  }

  async getUserById(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.userFactoryService.createUserDto(user))
      .then(user => this.userFactoryService.removeRestrictedProperties(user));
  }

  async getUserByIdUnrestricted(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async findUser(criterias: {}): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.userFactoryService.createUserDto(user))
      .then(user => this.userFactoryService.removeRestrictedProperties(user));
  }

  async findUserUnrestricted(criterias: {}): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.userFactoryService.createUserDto(user));
  }

  async findManyUsers(criterias: {}): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.userFactoryService.createUserDto(user)))
      .then(users => users.map(user => this.userFactoryService.removeRestrictedProperties(user)));
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const newUser = this.userFactoryService.createUser(userDto);
    return this.dataServicesRepositories.users.create(newUser)
      .then(user => this.userFactoryService.createUserDto(user))
      .then(user => this.userFactoryService.removeRestrictedProperties(user));
  }

  async updateUser(id: string, userDto: UserDto): Promise<UserDto> {
    const updatedUser = this.userFactoryService.updateUser(userDto);
    await this.getUserById(id)
      .then(user => {
        updatedUser.password =  this.cryptoService.checkPassword(user.password, updatedUser.password)
        ? user.password
        : this.cryptoService.hashPassword(updatedUser.password)
      })   
    return this.dataServicesRepositories.users.update(id, updatedUser)
      .then(user => this.userFactoryService.createUserDto(user))
      .then(user => this.userFactoryService.removeRestrictedProperties(user));
  }

  async deleteUser(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.delete(id)
      .then(user => this.userFactoryService.createUserDto(user))
      .then(user => this.userFactoryService.removeRestrictedProperties(user));
  }
}
