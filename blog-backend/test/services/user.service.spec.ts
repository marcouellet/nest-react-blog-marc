import { ForbiddenException} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'services/api/user/user.service';
import { UserFactoryService } from 'services/api/user/user-factory.service';
import { CryptographerService } from 'services/api/cryptographer.service';
import { DataServiceRepositories } from 'services/api/data.service.repositories';
import { User } from '@Shared/entities';
import { ConfigModule } from '@Modules/config.module';
import { IGenericDataRepository } from 'src/repositories/generic-data-repository.interface';

import { DataModuleStub } from '../stubs/data.module.stub';
import CryptographerServiceMock from '../mocks/cryptographer.service.mock';
import { testServiceUserDto, testServiceUserDtoUnrestricted, testUserId, testFindUserCriterias, testUserCount,
          testCreateUnknownUserDto, testCreateExistingUserDto, testUpdateUserNoPasswordSuppliedDto, testUpdateUserDto,
          testFindUserWithUnknownUserEmailCriterias, testUserUnrestricted, testUpdateUserSamePasswordSuppliedDto,
          testUpdateUserNewPasswordSuppliedDto } from '../data/user.data';

import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('UserService', () => {
  let userService: UserService;
  let dataServiceRepositories: DataServiceRepositories;
  let cryptoServiceMock: CryptographerService;
  let userRepositoryMock: IGenericDataRepository<User>;

  beforeAll(async () => {
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

  describe('reset mocks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
      it('should return an array of one user', async () => {
        expect(await userService.getAllUsers()).toEqual([testServiceUserDto]);
        expect(userRepositoryMock.getAll).toHaveBeenCalled();
      });
    });

    describe('getUser', () => {
      it('should return a user', async () => {
        expect(await userService.getUser(testUserId)).toEqual(testServiceUserDto);
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
        expect(await userService.createUser(testCreateUnknownUserDto)).toEqual(testServiceUserDtoUnrestricted);
        // check if a user exist with the same email (should not find any)
        expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserWithUnknownUserEmailCriterias);
        const foundUser = await userRepositoryMock.findOne(testFindUserWithUnknownUserEmailCriterias);
        expect(foundUser).toBe(undefined); // no user found with unknown@email.com
        expect(cryptoServiceMock.hashPassword).toHaveBeenCalledWith(testCreateUnknownUserDto.password);
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

    describe('updateUser - no password supplied', () => {
      it('should return a user', async () => {
        expect(await userService.updateUser(testUserId, testUpdateUserNoPasswordSuppliedDto)).toEqual(testServiceUserDtoUnrestricted);
        expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId); // check if user exist
        const foundUser = await userRepositoryMock.get(testUserId);
        expect(foundUser).toBe(testUserUnrestricted);
        expect(cryptoServiceMock.checkPassword).toHaveBeenCalledTimes(0);
        expect(cryptoServiceMock.hashPassword).toHaveBeenCalledTimes(0);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(testUserId, expect.anything(), undefined);
      });
    });

    describe('updateUser - same password supplied', () => {
      it('should return a user', async () => {
        expect(await userService.updateUser(testUserId, testUpdateUserSamePasswordSuppliedDto)).toEqual(testServiceUserDtoUnrestricted);
        expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId); // check if user exist
        const foundUser = await userRepositoryMock.get(testUserId);
        expect(foundUser).toBe(testUserUnrestricted);
        expect(cryptoServiceMock.checkPassword).toHaveBeenCalledWith(testUserUnrestricted.password, testUpdateUserSamePasswordSuppliedDto.password);
        expect(cryptoServiceMock.hashPassword).toHaveBeenCalledTimes(0);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(testUserId, expect.anything(), undefined);
      });
    });

    describe('updateUser - new password supplied', () => {
      it('should return a user', async () => {
        expect(await userService.updateUser(testUserId, testUpdateUserNewPasswordSuppliedDto)).toEqual(testServiceUserDtoUnrestricted);
        expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId); // check if user exist
        const foundUser = await userRepositoryMock.get(testUserId);
        expect(foundUser).toBe(testUserUnrestricted);
        expect(cryptoServiceMock.checkPassword).toHaveBeenCalledWith(testUserUnrestricted.password, testUpdateUserNewPasswordSuppliedDto.password);
        expect(cryptoServiceMock.hashPassword).toHaveBeenCalledWith(testUpdateUserNewPasswordSuppliedDto.password);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(testUserId, expect.anything(), undefined);
      });
    });

    describe('deleteUser', () => {
      it('should return a user', async () => {
        expect(await userService.deleteUser(testUserId)).toEqual(testServiceUserDto);
        expect(userRepositoryMock.get).toHaveBeenCalledWith(testUserId); // check if user exist
        expect(userRepositoryMock.delete).toHaveBeenCalledWith(testUserId, undefined);
      });
    });
  });
});
