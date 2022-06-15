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

  let dummyUserDtoWithTokens: UserDto;
  let adminUserDtoWithTokens: UserDto;
  let unknownUserDtoWithTokens: UserDto;

  jest.setTimeout(60000); // 1 minute

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();

    app.useLogger(['error', 'warn', 'debug']);

    if (!(authService = appModule.get<AuthService>(AuthService))) {
      Logger.error('AUTH: authService not found');
    };

    if (!(userService = appModule.get<UserService>(UserService))) {
      Logger.error('AUTH: userService not found');
    };
  
    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);

    // Remove test data in database

    await authDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_Auth);
    } catch (error) {
      Logger.error('AUTH: admin user registration failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Auth);
    } catch (error) {
      Logger.error('AUTH: dummy user registration failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('AUTH(1): (GET) /auth/whoami (not logged in)', () => {
    Logger.error('AUTH(1): (GET) /auth/whoami (not logged in)'); 
    Logger.flush();
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('AUTH(2): (POST) /auth/register existing user (admin) (not logged in)', () => {
    Logger.error('AUTH(2): (POST) /auth/register existing user (admin) (not logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('AUTH(2): (PUT) /auth/login admin user (not logged in) - cannot test since admin user registration failed'); 
      Logger.flush();       
    }
  });

  it('AUTH(3): (POST) /auth/register unknown user (not logged in)', () => {
    Logger.error('AUTH(3): (POST) /auth/register unknown user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterUnknownUser_Auth))
      .expect(StatusCodes.CREATED)
      .then(response => unknownUserDtoWithTokens = response.body);
  });

  it('AUTH(4): (PUT) /auth/refresh (not logged in)', () => {
    Logger.error('AUTH(4): (PUT) /auth/refresh (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('AUTH(5): (GET) /auth/whoami unknown user (unknown logged in)', () => {
    Logger.error('AUTH(5): (GET) /auth/whoami unknown user (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set("authorization", unknownUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(testE2EDummyUserJwtPayload_Auth);
    } else {
      Logger.error('AUTH(5): (GET) /auth/whoami dummy user (unknown logged in) - cannot test since unknown user registration failed');
      Logger.flush();
    }
  });

  it('AUTH(6): (POST) /auth/register existing user (admin) (admin logged in)', () => {
    Logger.error('AUTH(6): (POST) /auth/register existing user (admin) (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('AUTH(6): (PUT) /auth/login admin user (admin logged in) - cannot test since admin user registration failed'); 
      Logger.flush();       
    }
  });

  it('AUTH(7): (PUT) /auth/login admin user (admin logged in)', () => {
    Logger.error('AUTH(7): (PUT) /auth/login admin user (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(buildLoginDto(testE2ELoginAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('AUTH(7): (PUT) /auth/login admin user (admin logged in) - cannot test since admin user registration failed');
      Logger.flush(); 
    }
  });

  it('AUTH(8): (PUT) /auth/refresh unknown user (unknown logged in)', () => {
    Logger.error('AUTH(8): (PUT) /auth/refresh unknown user (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .set("authorization", unknownUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK);
    } else {
      Logger.error('AUTH(8): (PUT) /auth/refresh unknown user (unknown logged in) - cannot test since unknown user registration failed');
      Logger.flush();      
    }
  });
});
