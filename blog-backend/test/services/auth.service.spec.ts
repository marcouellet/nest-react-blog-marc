import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { AuthService } from '../../src/services/auth.service';
import ConfigServiceProvider from '../providers/config.service.provider';
import UserServiceProvider from '../providers/user.service.provider';
import JwtServiceProvider from '../providers/jwt.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { testUserDto, testServiceUserDto, testFindUserCriterias, testServiceUserDtoUnrestricted } from '../data/user.data';
import { testJwtPayload, testNotLoggedInDto, testAlreadyLoggedInDto, testNotRegisteredDto,
          testAlreadyRegisteredDto } from '../data/auth.data';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [AuthService, UserServiceProvider, JwtServiceProvider, ConfigServiceProvider, CryptographerServiceProvider],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getUserFromToken', () => {
    it('should return a user', async () => {
      expect(await authService.getUserFromToken('token')).toEqual(testServiceUserDto);
    });
  });

  describe('validateToken', () => {
    it('should return a payload', async () => {
      expect(await authService.getUserFromToken('token')).toEqual(testJwtPayload);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return a payload', async () => {
      expect(await authService.getUserFromToken('token')).toEqual(testJwtPayload);
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias)).toEqual(testServiceUserDto);
    });
  });

  describe('validateUser - admin required', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias, true)).toEqual(testServiceUserDto);
    });
  });

  describe('validateUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await authService.validateUserUnrestricted(testFindUserCriterias)).toEqual(testServiceUserDtoUnrestricted);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
      expect(await authService.login(testNotLoggedInDto)).toEqual(testUserDto);
    });
  });

  describe('login - when already logged in', () => {
    it('should throw exception', async () => {
      try {
        await authService.login(testAlreadyLoggedInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('register', () => {
    it('should return a user', async () => {
      expect(await authService.register(testNotRegisteredDto)).toEqual(testServiceUserDto);
    });
  });

  describe('register', () => {
    it('should throw an exception - user already defined', async () => {
      try {
        await authService.register(testAlreadyRegisteredDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
