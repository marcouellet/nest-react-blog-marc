import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user/user.service';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { testE2ELoginAdminUser_Auth, testE2ELoginDummyUser_Auth, testE2ERegisterAdminUser_Auth, testE2ERegisterDummyUser_Auth,
          testE2ERegisterUnknownUser_Auth, testE2EDummyUserJwtPayload_Auth } from '../data/auth.data';
import { UserDto } from '../../src/core';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let authDatabaseBuilder: AuthDatabaseBuilder;

  let dummyUserDto: UserDto;
  let adminUserDto: UserDto;
  let unknownUserDto: UserDto;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = appModule.get<AuthService>(AuthService);
 
    it('authService should be defined', () => {
      expect(authService).toBeDefined();
    });
  
    it('userService should be defined', () => {
      expect(userService).toBeDefined();
    });
  
    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);

    // Remove test data in database

    authDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_Auth);
    } catch (error) {}

    try {
      dummyUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Auth);
    } catch (error) {}

    app = appModule.createNestApplication();
    await app.init();
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
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(testE2ELoginAdminUser_Auth))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /auth/login dummy user (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(testE2ELoginDummyUser_Auth))
      .expect(StatusCodes.OK);
  });

  it('(POST) /auth/register existing user (admin) (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(JSON.stringify(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(POST) /auth/register unknown user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(JSON.stringify(testE2ERegisterUnknownUser_Auth))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDto = response.body);
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
    if (unknownUserDto) {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set("authorization", unknownUserDto.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(testE2EDummyUserJwtPayload_Auth);
    } else {
      Logger.error('(GET) /auth/whoami dummy user (logged in) - cannot test since unknown user creation failed');
    }
  });

  it('(PUT) /auth/refresh unknown user (logged in)', () => {
    if (unknownUserDto) {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .set("authorization", unknownUserDto.authtoken.accessToken)
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(PUT) /auth/refresh unknown user (logged in) - cannot test since unknown user registration failed')      
    }
  });
});
