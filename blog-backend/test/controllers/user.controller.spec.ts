import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/controllers/user.controller';
import UserServiceProvider from '../providers/user.service.provider';
import UserFactoryServiceProvider from '../providers/user.factory.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import { testUserDto, testCreateUserDto, testUpdateUserDto } from '../data/user.data';

describe('User Controller', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserFactoryServiceProvider, UserServiceProvider, CryptographerServiceProvider],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('userController should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one user"', async () => {
      expect(await userController.getAll()).toStrictEqual([testUserDto]);
    });
  });

  describe('getById', () => {
    it('should return one user"', async () => {
      expect(await userController.getById('1')).toStrictEqual(testUserDto);
    });
  });

  describe('createUser', () => {
    it('should return a user"', async () => {
      expect(await userController.createUser(testCreateUserDto)).toStrictEqual(testUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a user"', async () => {
      expect(await userController.updateUser('1', testUpdateUserDto)).toStrictEqual(testUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', async () => {
      expect(await userController.deleteUser('1')).toStrictEqual(testUserDto);
    });
  });

});
