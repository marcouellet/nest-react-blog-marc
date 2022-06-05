import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user/user.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import JwtServiceProvider from '../providers/jwt.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { testUserDto, testServiceUserDto, testFindUserCriterias, testServiceUserDtoUnrestricted,
          testFindUserAdminCriterias, testServiceUserAdminDto } from '../data/user.data';
import { testJwtPayload, testLoginDto, testAlreadyLoggedInDto, testRegisterUnknownUserDto, testLoginUnknownUserDto,
          testRegisterExistingUserDto } from '../data/auth.data';
import { ConfigModule } from '../../src/modules/config.module';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleMock.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [AuthService, UserService, UserFactoryService, JwtServiceProvider, CryptographerServiceProvider],
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
      expect(await authService.validateToken('token')).toEqual(testJwtPayload);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return a payload', async () => {
      expect(await authService.validateRefreshToken('token')).toEqual(testJwtPayload);
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias)).toEqual(testServiceUserDto);
    });
  });

  describe('validateUser - admin required with admin user supplied', () => {
    it('should return a user admin', async () => {
      expect(await authService.validateUser(testFindUserAdminCriterias, true)).toEqual(testServiceUserAdminDto);
    });
  });

  describe('validateUser - admin required with non admin user supplied', () => {
    it('should throw an exception', async () => {
      try {
        await authService.validateUser(testFindUserCriterias, true);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('validateUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await authService.validateUserUnrestricted(testFindUserCriterias)).toEqual(testServiceUserDtoUnrestricted);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
      expect(await authService.login(testLoginDto)).toEqual(testUserDto);
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

  describe('login - when user is unknown', () => {
    it('should throw exception', async () => {
      try {
        await authService.login(testLoginUnknownUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('register', () => {
    it('should return a user', async () => {
      expect(await authService.register(testRegisterUnknownUserDto)).toEqual(testServiceUserDto);
    });
  });

  describe('register', () => {
    it('should throw an exception - user already defined', async () => {
      try {
        await authService.register(testRegisterExistingUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
