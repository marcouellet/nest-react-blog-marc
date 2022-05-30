import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { UserService } from '../../src/services/user/user.service';
import DatatServiceProvider from '../providers/data.service.provider';
import UserFactoryServiceProvider from '../providers/user.factory.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import UserRepositoryProvider from '../providers/user.repository.provider';
import PostRepositoryProvider from '../providers/post.repository.provider';
import { testUserDto, testFindUserCriterias, testUserDtoUnrestricted, testCreateUserDto, testUpdateUserDto } from '../data/user.data';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatatServiceProvider.register(GetConfigMock()), UserService,
                UserFactoryServiceProvider, CryptographerServiceProvider,
                UserRepositoryProvider, PostRepositoryProvider],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of one user', () => {
      expect(userService.getAllUsers()).toBe([testUserDto]);
    });
  });

  describe('getUserById', () => {
    it('should return a user', () => {
      expect(userService.getUserById('1')).toBe(testUserDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return a user', () => {
      expect(userService.getUserByIdUnrestricted('1')).toBe([testUserDtoUnrestricted]);
    });
  });

  describe('findUser', () => {
    it('should return a user', () => {
      expect(userService.findUser(testFindUserCriterias)).toBe(testUserDto);
    });
  });

  describe('verifyUserExist', () => {
    it('should return a user', () => {
      expect(userService.verifyUserExist(testFindUserCriterias)).toBe(true);
    });
  });

  describe('findUserUnrestricted', () => {
    it('should return a user with password', () => {
      expect(userService.findUserUnrestricted(testFindUserCriterias)).toBe(testUserDtoUnrestricted);
    });
  });

  describe('findManyUsers', () => {
    it('should return an array of one user', () => {
      expect(userService.findManyUsers(testFindUserCriterias)).toBe([testUserDto]);
    });
  });

  describe('findManyUsersCount', () => {
    it('should return 1', () => {
      expect(userService.findManyUsersCount(testFindUserCriterias)).toBe(1);
    });
  });

  describe('createUser', () => {
    it('should return a user', () => {
      expect(userService.createUser(testCreateUserDto)).toBe(testUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a user', () => {
      expect(userService.updateUser('1', testUpdateUserDto)).toBe(testUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user', () => {
      expect(userService.deleteUser('1')).toBe(testUserDto);
    });
  });

});
