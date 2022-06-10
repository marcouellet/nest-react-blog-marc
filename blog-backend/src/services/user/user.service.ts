import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IDataRepositories } from '../../core/repositories';
import { User } from '../../core/entities';
import { UserRole } from '../../core/enum'
import { UserDto, UpdateUserDto } from '../../core/dtos';
import { UserCriterias } from '../../core/find-criterias/user.criterias';
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

  async getUserById(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.processUser(user));
  }

  async getUserByIdUnrestricted(id: string): Promise<UserDto> {
    return this.dataServicesRepositories.users.get(id)
      .then(user => this.processUserUnrestricted(user));
  }

  async findUser(criterias: UserCriterias): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => this.processUser(user));
  }

  async verifyUserExist(criterias: UserCriterias): Promise<boolean> {
    return this.dataServicesRepositories.users.findOne(criterias)
      .then(user => Promise.resolve(user != null));
  }

  async findUserUnrestricted(criterias: UserCriterias): Promise<UserDto> {
    return this.dataServicesRepositories.users.findOne(criterias)
    .then(user => this.processUserUnrestricted(user));
  }

  async findManyUsers(criterias: UserCriterias): Promise<UserDto[]> {
    return this.dataServicesRepositories.users.findMany(criterias)
      .then(users => users.map(user => this.processUser(user)));
  }

  async findManyUsersCount(criterias: UserCriterias): Promise<number> {
    return this.dataServicesRepositories.users.findManyCount(criterias);
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const createUserDto = { ... userDto };
    const { email } = createUserDto;
    if ( await this.verifyUserExist({ email })) {
      throw new ForbiddenException('User with same email already exist!');
    }
    createUserDto.role = userDto.role ? userDto.role :  UserRole.USER;
    createUserDto.password = this.cryptoService.hashPassword(userDto.password);
    const newUser = this.userFactoryService.createUser(createUserDto);
    return this.dataServicesRepositories.users.create(newUser)
      .then(user => this.processUserUnrestricted(user));
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const updatedUserCriterias = this.userFactoryService.createUpdateUserCriterias(updateUserDto);
    await this.getUserByIdUnrestricted(id)
      .then(user => {
        updatedUserCriterias.password =  (!updatedUserCriterias.password ||
          this.cryptoService.checkPassword(user.password, updatedUserCriterias.password))
        ? user.password
        : this.cryptoService.hashPassword(updatedUserCriterias.password);
      });
    return this.dataServicesRepositories.users.update(id, updatedUserCriterias)
      .then((user: User) => this.processUserUnrestricted(user));
   }

  async deleteUser(id: string): Promise<UserDto> {
    return this.getUserById(id)
      .then(_ =>  this.dataServicesRepositories.users.delete(id))
      .then(user => this.processUser(user));
  }
}
