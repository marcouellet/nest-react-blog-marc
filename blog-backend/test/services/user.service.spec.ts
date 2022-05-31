import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { UserService } from '../../src/services/user/user.service';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import UserFactoryServiceProvider from '../providers/user.factory.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import UserRepositoryProvider from '../providers/user.repository.provider';
import PostRepositoryProvider from '../providers/post.repository.provider';
import { testUserId, testUserDto, testFindUserCriterias, testUserDtoUnrestricted, testCreateUserDto, 
          testUpdateUserDto, testUserCount } from '../data/user.data';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [UserService, UserFactoryServiceProvider, CryptographerServiceProvider,
                  UserRepositoryProvider, PostRepositoryProvider],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.getAllUsers()).toEqual([testUserDto]);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      expect(await userService.getUserById(testUserId)).toEqual(testUserDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return a user', async () => {
      expect(await userService.getUserByIdUnrestricted(testUserId)).toEqual([testUserDtoUnrestricted]);
    });
  });

  describe('findUser', () => {
    it('should return a user', async () => {
      expect(await userService.findUser(testFindUserCriterias)).toEqual(testUserDto);
    });
  });

  describe('verifyUserExist', () => {
    it('should return a user', async () => {
      expect(await userService.verifyUserExist(testFindUserCriterias)).toEqual(true);
    });
  });

  describe('findUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await userService.findUserUnrestricted(testFindUserCriterias)).toEqual(testUserDtoUnrestricted);
    });
  });

  describe('findManyUsers', () => {
    it('should return an array of one user', async () => {
      expect(await userService.findManyUsers(testFindUserCriterias)).toEqual([testUserDto]);
    });
  });

  describe('findManyUsersCount', () => {
    it('should return testUserCount', async () => {
      expect(await userService.findManyUsersCount(testFindUserCriterias)).toEqual(testUserCount);
    });
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      expect(await userService.createUser(testCreateUserDto)).toEqual(testUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a user', () => {
      expect(userService.updateUser(testUserId, testUpdateUserDto)).toEqual(testUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user', () => {
      expect(userService.deleteUser(testUserId)).toEqual(testUserDto);
    });
  });
});
