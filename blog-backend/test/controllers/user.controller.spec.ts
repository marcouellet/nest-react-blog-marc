import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user/user.service';
import UserServiceProvider from '../providers/user.service.provider';
import { testUserId, testServiceUserDto, testCreateNonExistingUserDto, testUpdateUserDto, testFindUserCriterias,
          testServiceUserCount } from '../data/user.data';

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ UserServiceProvider ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('userController should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one user"', async () => {
      expect(await userController.getAll()).toStrictEqual([testServiceUserDto]);
      expect(userService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return one user"', async () => {
      expect(await userController.getById(testUserId)).toStrictEqual(testServiceUserDto);
      expect(userService.getUserById).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should return a user"', async () => {
      expect(await userController.createUser(testCreateNonExistingUserDto)).toStrictEqual(testServiceUserDto);
      expect(userService.createUser).toHaveBeenCalled();
    });
  });

  describe('finUser', () => {
    it('should return a user"', async () => {
      expect(await userController.finUser(testFindUserCriterias)).toStrictEqual(testServiceUserDto);
      expect(userService.findUser).toHaveBeenCalled();
    });
  });

  describe('finManyUsers', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.finManyUsers(testFindUserCriterias)).toStrictEqual([testServiceUserDto]);
      expect(userService.findManyUsers).toHaveBeenCalled();
    });
  });

  describe('finManyUsersCount', () => {
    it('should return an array of one user"', async () => {
      expect(await userController.findManyUsersCount(testFindUserCriterias)).toStrictEqual(testServiceUserCount);
      expect(userService.findManyUsersCount).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should return a user"', async () => {
      expect(await userController.updateUser(testUserId, testUpdateUserDto)).toStrictEqual(testServiceUserDto);
      expect(userService.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', async () => {
      expect(await userController.deleteUser(testUserId)).toStrictEqual(testServiceUserDto);
      expect(userService.deleteUser).toHaveBeenCalled();
    });
  });
});
