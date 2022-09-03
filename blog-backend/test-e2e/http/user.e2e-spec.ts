import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UserDto } from 'shared/dtos';
import { AppModule } from 'modules/app.module';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user/user.service';
import { PostService } from 'services/post/post.service';
import { buildCreateUserDto, buildUpdateUserDto } from 'shared/builders/user.dtos.builders';
import { buildLoginDto } from 'shared/builders/auth.dtos.builders';
import { StatusCodes } from 'http-status-codes';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { UserDatabaseBuilder } from '../database/user.database';
import { testE2ERegisterDummyUser_User, testE2ERegisterAdminUser_User, testE2EFindDummyUserCriterias_User,
        testE2ECreateUnknownUserDto_User, testE2EUpdateUnknownUserNameDto_User, testE2EFindUnknownUserNameUpdatedCriterias_User,
        testE2ENonExistingUserId_User, testE2EUpdateUnknownUserPasswordDto_User, testE2ELoginUnknownUser_User } from '../data/user.data';
import { CustomLogger } from 'common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let unknownUserDto: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let adminUserDtoWithTokens: UserDto;
  let unknownUserDtoWithTokens: UserDto;
  let unknownUserDtoNameUpdated: UserDto;
  let unknownUserDtoPasswordUpdated: UserDto;

  CustomLogger.setGlobalPrefix('User Controller E2E Tests');

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
      Logger.error('USER: authService not found');
      Logger.flush();
    }

    userService = appModule.get<UserService>(UserService);

    if (!userService) {
      Logger.error('USER: userService not found');
      Logger.flush();
    }

    postService = appModule.get<PostService>(PostService);

    if (!postService) {
      Logger.error('USER: postService not found');
      Logger.flush();
    }

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    userDatabaseBuilder = new UserDatabaseBuilder(userService, postService);

    // Remove test data in database

    await userDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUserAsAdmin(testE2ERegisterAdminUser_User);
    } catch (error) {
      Logger.error('USER: admin user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_User);
    } catch (error) {
      Logger.error('USER: dummy user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  });

  afterAll(async () => {
    await userDatabaseBuilder.deleteAllE2EUsers();
    await app.close();
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  //

  it('USER(1): (GET) /user - Fetch all users (not logged in)', () => {
    Logger.debug('USER(1): (GET) /user - Fetch all users (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('USER(2): (GET) /user/:userId - Fetch a particular user with :userId (not logged in)', () => {
    Logger.debug('USER(2): (GET) /user/:userId - Fetch a particular user with :userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDtoWithTokens.id}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(2): (GET) /user/:userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(3): (POST) /user/find - Fetch a user based on criterias (not logged in)', () => {
    Logger.debug('USER(3): (POST) /user/find - Fetch a user based on criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/find')
      .send(testE2EFindDummyUserCriterias_User)
      .expect(StatusCodes.CREATED)
      .expect(body => body != null);
    } else {
      Logger.error('USER(3): (POST) /user/find - Fetch a user based on criterias - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(4): (POST) /findMany - Fetch users based on criterias (not logged in)', () => {
    Logger.debug('USER(4): (POST) /findMany - Fetch users based on criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/findMany')
      .send(testE2EFindDummyUserCriterias_User)
      .expect(StatusCodes.CREATED)
      .expect(body => body != null);
    } else {
      Logger.error('USER(4): (POST) /findMany - Fetch users based on criterias - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(5): (POST) /user/findManyCount - Get count of users meating criterias (not logged in)', () => {
    Logger.debug('USER(5): (POST) /user/findManyCount - Get count of users meating criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/findManyCount')
      .send(testE2EFindDummyUserCriterias_User)
      .expect(StatusCodes.CREATED)
      .expect(body => body != null);
    } else {
      Logger.error('USER(5): (POST) /user/findManyCount - Get count of users meating criterias - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(6): (POST) /user/create - Submit a new user (not logged in)', () => {
    Logger.debug('USER(6): (POST) /user/create - Submit a new user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/user/create')
      .send(buildCreateUserDto(testE2ECreateUnknownUserDto_User))
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.warn('USER(6): (POST) /user/create - Submit a new user (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('USER(7): (PUT) /user/update/:userId - Update a user with :userId (not logged in)', () => {
    Logger.debug('USER(7): (PUT) /user/update/:userId - Update a user with :userId (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/user/update/${testE2ENonExistingUserId_User}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('USER(8): (DELETE) /user/delete/:userId - Delete a user (not logged in)', () => {
    Logger.debug('USER(8): (DELETE) /user/delete/:userId - Delete a user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .delete(`/user/delete/${testE2ENonExistingUserId_User}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('USER(9): (GET) /user - Fetch all users (admin logged in)', () => {
    Logger.debug('USER(9): (GET) /user - Fetch all users (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('USER(9): (GET) /user - Fetch all users (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(9): (GET) /user - Fetch all users (admin logged in) - cannot test since admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(10): (GET) /user - Fetch all users (dummy logged in)', () => {
    Logger.debug('USER(10): (GET) /user - Fetch all users (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(10): (GET) /user - Fetch all users (dummy logged in) - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId (admin logged in)', () => {
    Logger.debug('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/user/${adminUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId - cannot test since admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(12): (GET) /user/:userId - Fetch a particular user with dummy userId (dummy logged in)', () => {
    Logger.debug('USER(12): (GET) /user/:userId - Fetch a particular user with dummy userId (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(12): (GET) /user/:userId - Fetch a particular user with dummy userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(13): (POST) /user/create - Submit a new user (dummy logged in)', () => {
    Logger.debug('USER(13): (POST) /user/create - Submit a new user (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/create')
      .set('Authorization', dummyUserDtoWithTokens.authtoken.accessToken)
      .send(buildCreateUserDto(testE2ECreateUnknownUserDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(13): (POST) /user/create - Submit a new user (dummy logged in) - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(14): (POST) /user/create - Submit a new user (admin logged in)', () => {
    Logger.debug('USER(14): (POST) /user/create - Submit a new user (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/create')
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildCreateUserDto(testE2ECreateUnknownUserDto_User))
      .expect(StatusCodes.CREATED)
      .then(response => unknownUserDto = response.body)
      .catch(error => {
        Logger.warn('USER(14): (POST) /user/create - Submit a new user (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(14): (POST) /user/create - Submit a new user (admin logged in) - cannot test since admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(15): (POST) /auth/login unknown user (not logged in)', () => {
    Logger.debug('USER(15): (POST) /auth/login unknown user (not logged in)');
    Logger.flush();
    if (unknownUserDto) {
      return request(app.getHttpServer())
      .post('/auth/login')
      .send(buildLoginDto(testE2ELoginUnknownUser_User))
      .expect(StatusCodes.CREATED)
      .then(response => unknownUserDtoWithTokens = response.body);
    } else {
      Logger.error('USER(15): (POST) /auth/login unknown user (not logged in) - cannot test since unknown user creation failed');
      Logger.flush();
    }
  });

  it('USER(16): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (dummy logged in)', () => {
    Logger.debug('USER(16): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (dummy logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(16): (PUT) /user/update/:userId - Update a user name - cannot test since unknown user or dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(17): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (admin logged in)', () => {
    Logger.debug('USER(17): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (admin logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body)
      .catch(error => {
        Logger.error('USER(17): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(17): (PUT) /user/update/:userId - Update a user name - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(18): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (unknown logged in)', () => {
    Logger.debug('USER(18): (PUT) /user/update/:userId - Update a user name (unknown) with unknown userId (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${unknownUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(18): (PUT) /user/update/:userId - Update a user name - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(19): (POST) /user/find - Fetch a user based on username criteria (dummy logged in)', () => {
    Logger.debug('USER(19): (POST) /user/find - Fetch a user based on username criteria (dummy logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .post('/user/find')
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(testE2EFindUnknownUserNameUpdatedCriterias_User)
      .expect(StatusCodes.CREATED)
      .expect(body => body != null)
      .catch(error => {
        Logger.error('USER(19): (POST) /user/find - Fetch a user based on username criteria (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(19): (POST) /user/find - Fetch a user based on username criteria - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(20): (PUT) /user/update/:userId - Update a user password with unknown userId (admin logged in)', () => {
    Logger.debug('USER(20): (PUT) /user/update/:userId - Update a user password with unknown userId (admin logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserPasswordDto_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoPasswordUpdated = response.body)
      .catch(error => {
        Logger.error('USER(20): (PUT) /user/update/:userId - Update a user password with unknown userId (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(20): (PUT) /user/update/:userId - Update a user password - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(21): (DELETE) /user/delete/:userId -  Delete a user with unknown userid (dummy logged in)', () => {
    Logger.debug('USER(21): (DELETE) /user/delete/:userId -  Delete a user with unknown userid (dummy logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(21): (DELETE) /user/delete/:userId - cannot test since unknown user or dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(22): (DELETE) /user/delete/:userId - Delete a user with unknown userid (admin logged in)', () => {
    Logger.debug('USER(22): (DELETE) /user/delete/:userId - Delete a user with unknown userid (admin logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDtoWithTokens.id}`)
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('USER(22): (DELETE) /user/delete/:userId - Delete a user with unknown userid (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(22): (DELETE) /user/delete/:userId - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });
});
