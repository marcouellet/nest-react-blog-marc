import { UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'services/api/auth.service';
import { UserService } from 'services/api/user/user.service';
import { UserFactoryService } from 'services/api/user/user-factory.service';
import { CryptographerService } from 'services/api/cryptographer.service';
import { DataServiceRepositories } from 'services/api/data.service.repositories';
import { ConfigModule } from '@Modules/config.module';
import { User } from '@Shared/entities/user.entity';
import { IGenericDataRepository } from 'src/repositories/generic-data-repository.interface';

import JwtServiceMock from '../mocks/jwt.service.mock';
import CryptographerServiceMock from '../mocks/cryptographer.service.mock';
import { DataModuleStub } from '../stubs/data.module.stub';

import { testServiceUserDto, testFindUserCriterias, testServiceUserDtoUnrestricted, testFindUserAdminCriterias,
          testUserAdminDto, testUserDto, testFindUserWithDummyUserEmailCriterias,
          testFindUserWithUnknownUserEmailCriterias } from '../data/user.data';
import { testJwtPayload, testLoginDto, testAlreadyLoggedInDto, testRegisterUnknownUserDto, testLoginUnknownUserDto,
          testRegisterExistingUserDto } from '../data/auth.data';
import { testToken } from '../data/token.data';

import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtServiceMock: JwtService;
  let cryptoServiceMock: CryptographerService;
  let dataServiceRepositories: DataServiceRepositories;
  let userRepositoryMock: IGenericDataRepository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [AuthService, UserService, UserFactoryService, DataServiceRepositories, JwtServiceMock, CryptographerServiceMock],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    dataServiceRepositories = module.get<DataServiceRepositories>(DataServiceRepositories);
    jwtServiceMock = module.get<JwtService>(JwtService);
    cryptoServiceMock = module.get<CryptographerService>(CryptographerService);
    const repositories: any = dataServiceRepositories.repositories();
    userRepositoryMock = repositories.UserRepository; // UserRepository dymamically added by jest
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('dataServiceRepositories should be defined', () => {
    expect(dataServiceRepositories).toBeDefined();
  });

  it('userRepositoryMock should be defined', () => {
    expect(userRepositoryMock).toBeDefined();
  });

  it('jwtServiceMock should be defined', () => {
    expect(jwtServiceMock).toBeDefined();
  });

  it('cryptoServiceMock should be defined', () => {
    expect(cryptoServiceMock).toBeDefined();
  });

  describe('getUserFromToken', () => {
    it('should return a user', async () => {
      expect(await authService.getUserFromToken(testToken));
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(testToken, authService.getTokenVerifyOptions());
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserWithDummyUserEmailCriterias);
    });
  });

  describe('validateToken', () => {
    it('should return a payload', async () => {
      expect(await authService.validateToken(testToken)).toEqual(testJwtPayload);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(testToken, authService.getTokenVerifyOptions());
    });
  });

  describe('validateRefreshToken', () => {
    it('should return a payload', async () => {
      expect(await authService.validateRefreshToken(testToken)).toEqual(testJwtPayload);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(testToken, authService.getRefreshTokenVerifyOptions());
    });
  });

  describe('validateUser', () => {
    it('should return a user', async () => {
      expect(await authService.validateUser(testFindUserCriterias)).toEqual(testServiceUserDto);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('validateUser - admin required with admin user supplied', () => {
    it('should return a user admin', async () => {
      expect(await authService.validateUser(testFindUserAdminCriterias, true)).toEqual(testUserAdminDto);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserAdminCriterias);
    });
  });

  describe('validateUser - admin required with non admin user supplied', () => {
    it('should throw an exception', async () => {
      try {
        await authService.validateUser(testFindUserCriterias, true);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('validateUserUnrestricted', () => {
    it('should return a user with password', async () => {
      expect(await authService.validateUserUnrestricted(testFindUserCriterias)).toEqual(testServiceUserDtoUnrestricted);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserCriterias);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
      expect(await authService.login(testLoginDto)).toEqual(testUserDto);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserWithDummyUserEmailCriterias);
      expect(cryptoServiceMock.checkPassword).toHaveBeenCalled();
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
      expect(await authService.register(testRegisterUnknownUserDto)).toEqual(testUserDto);
      // check if a user exist with same email
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith(testFindUserWithUnknownUserEmailCriterias);
      expect(cryptoServiceMock.hashPassword).toHaveBeenCalledWith(testRegisterUnknownUserDto.password);
      expect(userRepositoryMock.create).toHaveBeenCalled();
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
