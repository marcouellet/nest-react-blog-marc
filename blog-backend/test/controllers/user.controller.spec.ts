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
    it('should return an array containing one user"', () => {
      expect(userController.getAll()).toBe([testUserDto]);
    });
  });

  describe('getById', () => {
    it('should return one user"', () => {
      expect(userController.getById('1')).toBe(testUserDto);
    });
  });

  describe('createUser', () => {
    it('should return a user"', () => {
      expect(userController.createUser(testCreateUserDto)).toBe(testUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a user"', () => {
      expect(userController.updateUser('1', testUpdateUserDto)).toBe(testUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should return a user"', () => {
      expect(userController.deleteUser('1')).toBe(testUserDto);
    });
  });

});
