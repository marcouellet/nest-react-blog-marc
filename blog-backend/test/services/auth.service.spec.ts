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
    it('should return a user', () => {
      expect(authService.getUserFromToken('token')).toBe(testUserDto);
    });
  });

  describe('validateToken', () => {
    it('should return a payload', () => {
      expect(authService.getUserFromToken('token')).toBe(testJwtPayload);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return a payload', () => {
      expect(authService.getUserFromToken('token')).toBe(testJwtPayload);
    });
  });

  describe('validateUser', () => {
    it('should return a user', () => {
      expect(authService.validateUser(testFindUserCriterias)).toBe(testUserDto);
    });
  });

  describe('validateUser - admin required', () => {
    it('should return a user', () => {
      expect(authService.validateUser(testFindUserCriterias, true)).toBe(testUserDto);
    });
  });

  describe('validateUser - admin required', () => {
    it('should return a user', () => {
      expect(authService.validateUser(testFindUserCriterias, true)).toBe(testUserDto);
    });
  });

  describe('validateUserUnrestricted', () => {
    it('should return a user with password', () => {
      expect(authService.validateUserUnrestricted(testFindUserCriterias)).toBe(testUserDtoUnrestricted);
    });
  });

  describe('login', () => {
    it('should return a user', () => {
      expect(authService.login(testLoginDto)).toBe(testUserDto);
    });
  });

  describe('register', () => {
    it('should return a user', () => {
      expect(authService.register(testRegisterDto)).toBe(testUserDto);
    });
  });

});
