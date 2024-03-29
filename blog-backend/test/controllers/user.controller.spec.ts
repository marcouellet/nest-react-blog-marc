import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from 'controllers/user.controller';
import { UserService } from 'services/user/user.service';
import UserServiceMock from '../mocks/user.service.mock';
import { testUserId, testServiceUserDtoUnrestricted, testCreateUnknownUserDto, testUpdateUserDto, testFindUserCriterias,
          testUserCount } from '../data/user.data';

describe('User Controller', () => {
  let userController: UserController;
  let userServiceMock: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ UserServiceMock ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userServiceMock = module.get<UserService>(UserService);
  });

  it('userController should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userServiceMock).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one user"', async () => {
      expect(await userController.getAll()).toStrictEqual([testServiceUserDtoUnrestricted]);
      expect(userServiceMock.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return one user"', async () => {
      expect(await userController.getById(testUserId)).toStrictEqual(testServiceUserDtoUnrestricted);
      expect(userServiceMock.getUser).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should return a user"', async () => {
      expect(await userController.createUser(testCreateUnknownUserDto)).toStrictEqual(testServiceUserDtoUnrestricted);
      expect(userServiceMock.createUser).toHaveBeenCalled();
    });
  });

  describe('finUser', () => {
    it('should return a user"', async () => {
      expect(await userController.finUser(testFindUserCriterias)).toStrictEqual(testServiceUserDtoUnrestricted);
      expect(userServiceMock.findUser).toHaveBeenCalled();
    });
  });

  describe('finManyUsers', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.finManyUsers(testFindUserCriterias)).toStrictEqual([testServiceUserDtoUnrestricted]);
      expect(userServiceMock.findManyUsers).toHaveBeenCalled();
    });
  });

  describe('finManyUsersCount', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.findManyUsersCount(testFindUserCriterias)).toStrictEqual(testUserCount);
      expect(userServiceMock.findManyUsersCount).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should return a user"', async () => {
      expect(await userController.updateUser(testUserId, testUpdateUserDto)).toStrictEqual(testServiceUserDtoUnrestricted);
      expect(userServiceMock.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', async () => {
      expect(await userController.deleteUser(testUserId)).toStrictEqual(testServiceUserDtoUnrestricted);
      expect(userServiceMock.deleteUser).toHaveBeenCalled();
    });
  });
});
