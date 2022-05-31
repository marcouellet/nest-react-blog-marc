import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { UserService } from '../../src/services/user/user.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import UserRepositoryProvider from '../providers/user.repository.provider';
import PostRepositoryProvider from '../providers/post.repository.provider';
import { testUserId, testServiceUserDto, testFindUserCriterias, testCreateUserDto,
          testUpdateUserDto, testUserPostsCount, testServiceUserDtoUnrestricted } from '../data/user.data';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [UserService, UserFactoryService, CryptographerServiceProvider,
                  UserRepositoryProvider, PostRepositoryProvider],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.getAllUsers()).toEqual([testServiceUserDto]);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      expect(await userService.getUserById(testUserId)).toEqual(testServiceUserDto);
    });
  });

  describe('getUserByIdUnrestricted', () => {
    it('should return a user', async () => {
      const received = await userService.getUserByIdUnrestricted(testUserId);
      expect(await userService.getUserByIdUnrestricted(testUserId)).toEqual(testServiceUserDtoUnrestricted);
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
    it('should return testUserCount', async () => {
      expect(await userService.findManyUsersCount(testFindUserCriterias)).toEqual(testUserPostsCount);
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      expect(await userService.createUser(testCreateUserDto)).toEqual(testServiceUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a user', () => {
      expect(userService.updateUser(testUserId, testUpdateUserDto)).toEqual(testServiceUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user', () => {
      expect(userService.deleteUser(testUserId)).toEqual(testServiceUserDto);
    });
  });
});
