import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user/user.service';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { buildLoginDto, buildRegisterDto } from '../../test/builders/auth.dtos.builders';
import { testE2ELoginAdminUser_Auth, testE2ELoginDummyUser_Auth, testE2ERegisterAdminUser_Auth, testE2ERegisterDummyUser_Auth,
          testE2ERegisterUnknownUser_Auth, testE2EDummyUserJwtPayload_Auth, testE2ELoginUnknownUser_Auth } from '../data/auth.data';
import { UserDto } from '../../src/core';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let authDatabaseBuilder: AuthDatabaseBuilder;

  let dummyUserDto: UserDto;
  let adminUserDto: UserDto;
  let unknownUserDto: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let unknownUserDtoWithTokens: UserDto;

  jest.setTimeout(60000); // 1 minute

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();

    if (!(authService = appModule.get<AuthService>(AuthService))) {
      Logger.error('authService not found');
    };

    if (!(userService = appModule.get<UserService>(UserService))) {
      Logger.error('userService not found');
    };
  
    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);

    // Remove test data in database

    await authDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_Auth);
    } catch (error) {
      Logger.error(error);
    }

    try {
      dummyUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Auth);
    } catch (error) {
      Logger.error(error);
    }
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('(GET) /auth/whoami (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /auth/login admin user (not logged in)', () => {
    if (adminUserDto) {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(buildLoginDto(testE2ELoginAdminUser_Auth))
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(PUT) /auth/login admin user (not logged in) - cannot test since admin user creation failed'); 
    }
  });

  it('(PUT) /auth/login dummy user (not logged in)', () => {
    if (dummyUserDto) {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(buildLoginDto(testE2ELoginDummyUser_Auth))
      .expect(StatusCodes.OK)
      .then(response => dummyUserDtoWithTokens = response.body);
    } else {
      Logger.error('(PUT) /auth/login admin user (not logged in) - cannot test since dummy user creation failed');      
    }
  });

  it('(POST) /auth/register existing user (admin) (not logged in)', () => {
    if (adminUserDto) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('(PUT) /auth/login admin user (not logged in) - cannot test since admin user creation failed');        
    }
  });

  it('(POST) /auth/register unknown user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterUnknownUser_Auth))
      .expect(StatusCodes.CREATED)
      .then(response => unknownUserDtoWithTokens = response.body);
  });

  it('(PUT) /auth/refresh (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(GET) /auth/whoami unknown user (logged in)', () => {
    if (unknownUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set("authorization", unknownUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(testE2EDummyUserJwtPayload_Auth);
    } else {
      Logger.error('(GET) /auth/whoami dummy user (logged in) - cannot test since unknown user creation failed');
    }
  });

  it('(PUT) /auth/refresh unknown user (logged in)', () => {
    if (unknownUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .set("authorization", unknownUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(PUT) /auth/refresh unknown user (logged in) - cannot test since unknown user registration failed')      
    }
  });
});
