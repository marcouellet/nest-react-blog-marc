import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controllers/user.controller';
import UserServiceProvider from '../providers/user.service.provider';
import { testUserId, testServiceUserDto, testCreateNonExistingUserDto, testUpdateUserDto, testFindUserCriterias,
          testServiceUserCount } from '../data/user.data';

describe('User Controller', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ UserServiceProvider ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('userController should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one user"', async () => {
      expect(await userController.getAll()).toStrictEqual([testServiceUserDto]);
    });
  });

  describe('getById', () => {
    it('should return one user"', async () => {
      expect(await userController.getById(testUserId)).toStrictEqual(testServiceUserDto);
    });
  });

  describe('createUser', () => {
    it('should return a user"', async () => {
      expect(await userController.createUser(testCreateNonExistingUserDto)).toStrictEqual(testServiceUserDto);
    });
  });

  describe('finUser', () => {
    it('should return a user"', async () => {
      expect(await userController.finUser(testFindUserCriterias)).toStrictEqual(testServiceUserDto);
    });
  });

  describe('finManyUsers', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.finManyUsers(testFindUserCriterias)).toStrictEqual([testServiceUserDto]);
    });
  });

  describe('finManyUsersCount', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.findManyUsersCount(testFindUserCriterias)).toStrictEqual(testServiceUserCount);
    });
  });

  describe('updateUser', () => {
    it('should return a user"', async () => {
      expect(await userController.updateUser(testUserId, testUpdateUserDto)).toStrictEqual(testServiceUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', async () => {
      expect(await userController.deleteUser(testUserId)).toStrictEqual(testServiceUserDto);
    });
  });
});
