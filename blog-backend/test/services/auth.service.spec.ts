import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service';
import ConfigServiceProvider from '../providers/config.service.provider';
import UserServiceProvider from '../providers/user.service.provider';
import JwtServiceProvider from '../providers/jwt.service.provider';
import CryptographerServiceProvider from '../providers/cryptographer.service.provider';
import { testUserDto, testFindUserCriterias, testUserDtoUnrestricted } from '../data/user.data';
import { testJwtPayload, testLoginDto, testRegisterDto } from '../data/auth.data';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserServiceProvider, JwtServiceProvider, ConfigServiceProvider, CryptographerServiceProvider],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('getUserFromToken', () => {
    it('should return a user', async () => {
      expect(await authService.getUserFromToken('token')).toEqual(testUserDto);
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
      expect(await authService.validateUser(testFindUserCriterias)).toEqual(testUserDto);
    });
  });

  describe('validateUser - admin required', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias, true)).toEqual(testUserDto);
    });
  });

  describe('validateUser - admin required', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias, true)).toEqual(testUserDto);
    });
  });

  describe('validateUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await authService.validateUserUnrestricted(testFindUserCriterias)).toEqual(testUserDtoUnrestricted);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
      expect(await authService.login(testLoginDto)).toEqual(testUserDto);
    });
  });

  describe('register', () => {
    it('should return a user', async () => {
      expect(await authService.register(testRegisterDto)).toEqual(testUserDto);
    });
  });
});
