import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { IDataRepositories } from '../../core/repositories';
import { User } from '../../core/entities';
import { UserRole } from '../../core/enum';
import { UserDto, UpdateUserDto } from '../../core/dtos';
import { FilterFindCriterias } from '../../core/find-criterias/filter.find-criterias';
import { UserFindCriterias } from '../../core/find-criterias/user.find-criterias';
import { UserFactoryService } from './user-factory.service';
import { CryptographerService } from '../../services/cryptographer.service';
@Injectable()
export class UserService {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories,
    private readonly userFactoryService: UserFactoryService,
    private readonly cryptoService: CryptographerService,
  ) {}

  private processUser(user: User): UserDto {
    const userDto = this.processUserUnrestricted(user);
    return this.userFactoryService.removeRestrictedProperties(userDto);
  }

  private processUserUnrestricted(user: User): UserDto {
    if (user) {
      return this.userFactoryService.createUserDto(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async getAllUsers(): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.getAll()
      .then(users => users.map(user => this.processUser(user)));
  }

  async getUser(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.processUser(user));
  }

  async getUserByIdUnrestricted(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.processUserUnrestricted(user));
  }

  async findUser(criterias: UserFindCriterias | FilterFindCriterias): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.processUser(user));
  }

  async verifyUserExist(criterias: UserFindCriterias | FilterFindCriterias): Promise<boolean> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => Promise.resolve(user != null))
      .catch(error => { throw new Error(error); });
  }

  async findUserUnrestricted(criterias: UserFindCriterias | FilterFindCriterias): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
    .then(user => this.processUserUnrestricted(user));
  }

  async findManyUsers(criterias: UserFindCriterias | FilterFindCriterias): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.processUser(user)));
  }

  async findManyUsersCount(criterias: UserFindCriterias | FilterFindCriterias): Promise<number> {
    return this.dataServicesRepositories.users.findManyCount(criterias);
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const createUserDto = { ... userDto };
    const { email } = createUserDto;
    let user: UserDto;
    try {
      user = await this.findUser({ email });
    // tslint:disable-next-line: no-empty
    } catch (error) {}
    if (user) {
      throw new ForbiddenException(`User with email "${email}" already exist!`);
    }
    createUserDto.role = userDto.role ? userDto.role :  UserRole.USER;
    createUserDto.password = this.cryptoService.hashPassword(userDto.password);
    const newUser = this.userFactoryService.createUser(createUserDto);
    return this.dataServicesRepositories.users.create(newUser)
      // tslint:disable-next-line: no-shadowed-variable
      .then(user => this.processUserUnrestricted(user));
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const updatedUserCriterias = this.userFactoryService.createUpdateUserCriterias(updateUserDto);
    await this.getUserByIdUnrestricted(id)
      .then(async (user) => {
        if (user.email !== updateUserDto.email) {
          let userForEmail: UserDto;
          const newEmail = updateUserDto.email;
          try {
            userForEmail = await this.findUser({email: newEmail });
          // tslint:disable-next-line: no-empty
          } catch (error) {}
          if (userForEmail) {
            throw new ForbiddenException(`User with email "${newEmail}" already exist!`);
          }
        }
        updatedUserCriterias.password =  (!updatedUserCriterias.password ||
          this.cryptoService.checkPassword(user.password, updatedUserCriterias.password))
        ? user.password
        : this.cryptoService.hashPassword(updatedUserCriterias.password);
      });
    if (!updateUserDto.image) {
      await this.dataServicesRepositories.users.unset(id, {image: ''});
    }
    return this.dataServicesRepositories.users.update(id, updatedUserCriterias)
      .then((user: User) => this.processUserUnrestricted(user));
   }

  async deleteUser(id: string): Promise<UserDto> {
    return this.getUser(id)
      .then(_ =>  this.dataServicesRepositories.users.delete(id))
      .then(user => this.processUser(user));
  }
}
