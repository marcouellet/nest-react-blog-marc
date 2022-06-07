import { ForbiddenException} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/services/user/user.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { CryptographerService } from '../../src/services/cryptographer.service';
import { DataModuleStub } from '../stubs/data.module.stub';
import CryptographerServiceMock from '../mock/cryptographer.service.mock';
import UserRepositoryStubProvider from '../providers/user.repository.stub.provider';
import PostRepositoryStubProvider from '../providers/post.repository.stub.provider';
import { testServiceUserId, testServiceUserDto, testFindUserCriterias, testCreateNonExistingUserDto, testCreateExistingUserDto,
          testUpdateUserDto, testServiceUserCount, testServiceUserDtoUnrestricted } from '../data/user.data';
import { ConfigModule } from '../../src/modules/config.module';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('UserService', () => {
  let userService: UserService;
  let cryptoServiceMock: CryptographerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [UserService, UserFactoryService, CryptographerServiceMock,
                  UserRepositoryStubProvider, PostRepositoryStubProvider],
    }).compile();

    userService = module.get<UserService>(UserService);
    cryptoServiceMock = module.get<CryptographerService>(CryptographerService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('cryptoServiceMock should be defined', () => {
    expect(cryptoServiceMock).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.getAllUsers()).toEqual([testServiceUserDto]);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      expect(await userService.getUserById(testServiceUserId)).toEqual(testServiceUserDto);
    });
  });

  describe('getUserByIdUnrestricted', () => {
    it('should return a user', async () => {
      const received = await userService.getUserByIdUnrestricted(testServiceUserId);
      expect(await userService.getUserByIdUnrestricted(testServiceUserId)).toEqual(testServiceUserDtoUnrestricted);
    });
  });

  describe('findUser', () => {
    it('should return a user', async () => {
      expect(await userService.findUser(testFindUserCriterias)).toEqual(testServiceUserDto);
    });
  });

  describe('verifyUserExist', () => {
    it('should return a user', async () => {
      expect(await userService.verifyUserExist(testFindUserCriterias)).toEqual(true);
    });
  });

  describe('findUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await userService.findUserUnrestricted(testFindUserCriterias)).toEqual(testServiceUserDtoUnrestricted);
    });
  });

  describe('findManyUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.findManyUsers(testFindUserCriterias)).toEqual([testServiceUserDto]);
    });
  });

  describe('findManyUsersCount', () => {
    it('should return testServiceUserCount', async () => {
      expect(await userService.findManyUsersCount(testFindUserCriterias)).toEqual(testServiceUserCount);
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      expect(await userService.createUser(testCreateNonExistingUserDto)).toEqual(testServiceUserDto);
      expect(cryptoServiceMock.hashPassword).toHaveBeenCalled();
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
      expect(await userService.updateUser(testServiceUserId, testUpdateUserDto)).toEqual(testServiceUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user', async () => {
      expect(await userService.deleteUser(testServiceUserId)).toEqual(testServiceUserDto);
    });
  });
});
