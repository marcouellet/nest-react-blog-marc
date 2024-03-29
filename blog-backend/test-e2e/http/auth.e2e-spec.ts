import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UserDto } from 'shared/dtos';
import { IRefresh } from 'shared/interfaces/jwt-refresh.interface';
import { AppModule } from 'modules/app.module';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user/user.service';
import { buildLoginDto, buildRegisterDto } from 'shared/builders/auth.dtos.builders';
import { StatusCodes } from 'http-status-codes';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { testE2ELoginNonExistingUser_Auth, testE2ERegisterAdminUser_Auth, testE2ERegisterDummyUser_Auth,
          testE2ERegisterUnknownUser_Auth, testE2EUnknownUserJwtPayload_Auth } from '../data/auth.data';
import { CustomLogger } from 'common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let authDatabaseBuilder: AuthDatabaseBuilder;

  let dummyUserDtoWithTokens: UserDto;
  let adminUserDtoWithTokens: UserDto;
  let unknownUserDtoWithTokens: UserDto;

  CustomLogger.setGlobalPrefix('AuthController E2E Tests');

  jest.setTimeout(60000); // 1 minute

  beforeAll(async () => {

    const moduleBuilder = await Test.createTestingModule({
      imports: [AppModule.register(GLOBAL_TEST_E2E_CONFIG_SERVICE)],
    });

    moduleBuilder.setLogger(new CustomLogger());
    const appModule: TestingModule = await moduleBuilder.compile();

    app = appModule.createNestApplication();
    await app.init();

    authService = appModule.get<AuthService>(AuthService);

    if (!authService) {
      Logger.error('AUTH: authService not found');
      Logger.flush();
    }

    userService = appModule.get<UserService>(UserService);

    if (!userService) {
      Logger.error('AUTH: userService not found');
      Logger.flush();
    }

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);

    // Remove test data in database

    await authDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUserAsAdmin(testE2ERegisterAdminUser_Auth);
    } catch (error) {
      Logger.error('AUTH: admin user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Auth);
    } catch (error) {
      Logger.error('AUTH: dummy user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  });

  afterAll(async () => {
    await authDatabaseBuilder.deleteAllE2EUsers();
    await app.close();
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  //

  it('AUTH(1): (GET) /auth/whoami (not logged in)', () => {
    Logger.debug('AUTH(1): (GET) /auth/whoami (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.error('AUTH(1): (GET) /auth/whoami (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('AUTH(2): (PUT) /auth/login non existing user (not logged in)', () => {
    Logger.debug('AUTH(2): (PUT) /auth/login non existing user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
    .put('/auth/login')
    .send(buildLoginDto(testE2ELoginNonExistingUser_Auth))
    .expect(StatusCodes.NOT_FOUND)
    .catch(error => {
      Logger.error('AUTH(2): (PUT) /auth/login non existing user (not logged in) failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    });
  });

  it('AUTH(3): (POST) /auth/register existing user (admin) (not logged in)', () => {
    Logger.debug('AUTH(3): (POST) /auth/register existing user (admin) (not logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('AUTH(3): (POST) /auth/register existing user (admin) (not logged in) - cannot test since admin user registration failed');
      Logger.flush();
    }
  });

  it('AUTH(4): (POST) /auth/register unknown user (not logged in)', () => {
    Logger.debug('AUTH(4): (POST) /auth/register unknown user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterUnknownUser_Auth))
      .expect(StatusCodes.CREATED)
      .then(response => unknownUserDtoWithTokens = response.body)
      .catch(error => {
        Logger.error('AUTH(4): (POST) /auth/register unknown user (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('AUTH(5): (POST) /auth/session/refresh (not logged in)', () => {
    Logger.debug('AUTH(5): (POST) /auth/session/refresh (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/auth/session/refresh')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('AUTH(6): (GET) /auth/whoami unknown user (unknown logged in)', () => {
    Logger.debug('AUTH(6): (GET) /auth/whoami unknown user (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Authorization', `Bearer ${unknownUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .expect(testE2EUnknownUserJwtPayload_Auth)
      .catch(error => {
        Logger.error('AUTH(6): (GET) /auth/whoami unknown user (unknown logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('AUTH(6): (GET) /auth/whoami dummy user (unknown logged in) - cannot test since unknown user registration failed');
      Logger.flush();
    }
  });

  it('AUTH(7): (POST) /auth/register existing user (admin) (admin logged in)', () => {
    Logger.debug('AUTH(7): (POST) /auth/register existing user (admin) (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(buildRegisterDto(testE2ERegisterAdminUser_Auth))
      .expect(StatusCodes.FORBIDDEN);
    } else {
      Logger.error('AUTH(7): (POST) /auth/register existing user (admin) (admin logged in) - cannot test since admin user registration failed');
      Logger.flush();
    }
  });

  it('AUTH(8): (POST) /auth/session/refresh unknown user (unknown logged in)', () => {
    Logger.debug('AUTH(8): (POST) /auth/session/refresh unknown user (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens) {
      const authtoken = unknownUserDtoWithTokens.authtoken;
      const authrefreshtoken = unknownUserDtoWithTokens.authrefreshtoken;
      const refreshParms: IRefresh = { authtoken, authrefreshtoken };
      return request(app.getHttpServer())
        .post('/auth/session/refresh')
        .set('Authorization', `Bearer ${unknownUserDtoWithTokens.authtoken.accessToken}`)
        .send(refreshParms)
        .expect(StatusCodes.CREATED)
        .catch(error => {
          Logger.error('AUTH(8): (POST) /auth/session/refresh unknown user (unknown logged in) failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('AUTH(8): (POST) /auth/session/refresh unknown user (unknown logged in) - cannot test since unknown user registration failed');
      Logger.flush();
    }
  });
});
