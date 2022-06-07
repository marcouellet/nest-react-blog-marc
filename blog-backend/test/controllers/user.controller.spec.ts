import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user/user.service';
import UserServiceMock from '../mock/user.service.mock';
import { testUserId, testServiceUserDto, testCreateNonExistingUserDto, testUpdateUserDto, testFindUserCriterias,
          testServiceUserCount } from '../data/user.data';

describe('User Controller', () => {
  let userController: UserController;
  let userServiceMock: UserService;

  beforeEach(async () => {
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
      expect(await userController.getAll()).toStrictEqual([testServiceUserDto]);
      expect(userServiceMock.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return one user"', async () => {
      expect(await userController.getById(testUserId)).toStrictEqual(testServiceUserDto);
      expect(userServiceMock.getUserById).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should return a user"', async () => {
      expect(await userController.createUser(testCreateNonExistingUserDto)).toStrictEqual(testServiceUserDto);
      expect(userServiceMock.createUser).toHaveBeenCalled();
    });
  });

  describe('finUser', () => {
    it('should return a user"', async () => {
      expect(await userController.finUser(testFindUserCriterias)).toStrictEqual(testServiceUserDto);
      expect(userServiceMock.findUser).toHaveBeenCalled();
    });
  });

  describe('finManyUsers', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.finManyUsers(testFindUserCriterias)).toStrictEqual([testServiceUserDto]);
      expect(userServiceMock.findManyUsers).toHaveBeenCalled();
    });
  });

  describe('finManyUsersCount', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.findManyUsersCount(testFindUserCriterias)).toStrictEqual(testServiceUserCount);
      expect(userServiceMock.findManyUsersCount).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should return a user"', async () => {
      expect(await userController.updateUser(testUserId, testUpdateUserDto)).toStrictEqual(testServiceUserDto);
      expect(userServiceMock.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', async () => {
      expect(await userController.deleteUser(testUserId)).toStrictEqual(testServiceUserDto);
      expect(userServiceMock.deleteUser).toHaveBeenCalled();
    });
  });
});
