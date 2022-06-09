import { ForbiddenException} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/services/user/user.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { CryptographerService } from '../../src/services/cryptographer.service';
import { DataServiceRepositories } from '../../src/services/data.service.repositories';
import { DataModuleStub } from '../stubs/data.module.stub';
import { User } from '../../src/core/entities/user.entity';
import { IGenericDataRepository } from '../../src/core/repositories/generic-data-repository.abstract';
import CryptographerServiceMock from '../mocks/cryptographer.service.mock';
import { testServiceUserDto, testServiceUserDtoUnrestricted, testUserId, testFindUserCriterias, testUserCount,
          testCreateUnknownUserDto, testCreateExistingUserDto, testUpdateUserDto, 
          testFindUserWithUnknownUserEmailCriterias } from '../data/user.data';
import { ConfigModule } from '../../src/modules/config.module';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('UserService', () => {
  let userService: UserService;
  let dataServiceRepositories: DataServiceRepositories;
  let cryptoServiceMock: CryptographerService;
  let userRepositoryMock: IGenericDataRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [UserService, UserFactoryService, DataServiceRepositories, CryptographerServiceMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    cryptoServiceMock = module.get<CryptographerService>(CryptographerService);
    dataServiceRepositories = module.get<DataServiceRepositories>(DataServiceRepositories);
    const repositories: any = dataServiceRepositories.repositories();
    userRepositoryMock = repositories.UserRepository; // UserRepository dymamically added by jest
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('cryptoServiceMock should be defined', () => {
    expect(cryptoServiceMock).toBeDefined();
  });

  it('dataServiceRepositories should be defined', () => {
    expect(dataServiceRepositories).toBeDefined();
  });

  it('userRepositoryMock should be defined', () => {
    expect(userRepositoryMock).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.getAllUsers()).toEqual([testServiceUserDto]);
      expect(userRepositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      expect(await userService.getUserById(testUserId)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId);
    });
  });

  describe('getUserByIdUnrestricted', () => {
    it('should return a user', async () => {
      expect(await userService.getUserByIdUnrestricted(testUserId)).toEqual(testServiceUserDtoUnrestricted);
      expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId);
    });
  });

  describe('findUser', () => {
    it('should return a user', async () => {
      expect(await userService.findUser(testFindUserCriterias)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('verifyUserExist', () => {
    it('should return a user', async () => {
      expect(await userService.verifyUserExist(testFindUserCriterias)).toEqual(true);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('findUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await userService.findUserUnrestricted(testFindUserCriterias)).toEqual(testServiceUserDtoUnrestricted);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('findManyUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.findManyUsers(testFindUserCriterias)).toEqual([testServiceUserDto]);
      expect(userRepositoryMock.findMany).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('findManyUsersCount', () => {
    it('should return testUserCount', async () => {
      expect(await userService.findManyUsersCount(testFindUserCriterias)).toEqual(testUserCount);
      expect(userRepositoryMock.findManyCount).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      expect(await userService.createUser(testCreateUnknownUserDto)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserWithUnknownUserEmailCriterias);
     // expect(cryptoServiceMock.hashPassword).toHaveBeenCalledWith(testCreateUnknownUserDto.password);
      expect(userRepositoryMock.create).toHaveBeenCalled();
    });
  });

  describe('createUser - user with same email already exist', () => {
    it('should throw an axception', async () => {
      try {
        await userService.createUser(testCreateExistingUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('updateUser', () => {
    it('should return a user', async () => {
      expect(await userService.updateUser(testUserId, testUpdateUserDto)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return a user', async () => {
      expect(await userService.deleteUser(testUserId)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId); // check if user exist
      // expect(userRepositoryMock.delete).toHaveBeenCalledWith(testUserId);
    });
  });
});
