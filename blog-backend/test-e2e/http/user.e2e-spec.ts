import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { UserDatabaseBuilder } from '../database/user.database';
import { buildLoginDto } from '../../test/builders/auth.dtos.builders';
import { buildCreateUserDto, buildUpdateUserDto, buildFindUserCriterias } from '../../test/builders/user.dtos.builders';
import { testE2ERegisterDummyUser_User, testE2ERegisterAdminUser_User, testE2EFindDummyUserCriterias_User,
        testE2ECreateUnknownUserDto_User, testE2EUpdateUnknownUserNameDto_User, testE2EFindUnknownUserNameCriterias_User,
        testE2ENonExistingUserId_User, testE2EUpdateUnknownUserPasswordDto_User, testE2ELoginUnknownUser_User } from '../data/user.data';
import { UserDto } from '../../src/core';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let dummyUserDtoWithTokens: UserDto;
  let adminUserDtoWithTokens: UserDto;
  let unknownUserDtoWithTokens: UserDto;
  let unknownUserDto: UserDto;
  let unknownUserDtoNameUpdated: UserDto;
  let unknownUserDtoPasswordUpdated: UserDto;

  jest.setTimeout(60000); // 1 minute

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    await app.init();

    app.useLogger(['error', 'warn', 'debug']);

    if (!(authService = appModule.get<AuthService>(AuthService))) {
      Logger.error('USER: authService not found');
      Logger.flush();
    };

    if (!(userService = appModule.get<UserService>(UserService))) {
      Logger.error('USER: userService not found');
      Logger.flush();
    };

    if (!(postService = appModule.get<PostService>(PostService))) {
      Logger.error('USER: postService not found');
      Logger.flush();
    };

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    userDatabaseBuilder = new UserDatabaseBuilder(userService, postService);

    // Remove test data in database

     await userDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_User);
    } catch (error) {
      Logger.error('USER: admin user registration failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_User);
    } catch (error) {
      Logger.error('USER: dummy user registration failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('USER(1): (GET) /user - Fetch all users (not logged in)', () => {
    Logger.error('USER(1): (GET) /user - Fetch all users (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('USER(2): (GET) /user/:userId - Fetch a particular user with :userId (not logged in)', () => {
    Logger.error('USER(2): (GET) /user/:userId - Fetch a particular user with :userId (not logged in)');
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

  it('USER(3): (PUT) /user/find - Fetch a user based on criterias (not logged in)', () => {
    Logger.error('USER(3): (PUT) /user/find - Fetch a user based on criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .put('/user/find')
      .send(buildFindUserCriterias(testE2EFindDummyUserCriterias_User))
      .expect(StatusCodes.NOT_FOUND);
    } else {
      Logger.error('USER(3): (PUT) /user/find - Fetch a user based on criterias - cannot test since dummy user creation failed'); 
      Logger.flush();   
    }
  });

  it('USER(4): (PUT) /findAll - Fetch users based on criterias (not logged in)', () => {
    Logger.error('USER(4): (PUT) /findAll - Fetch users based on criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .put('/user/findAll')
      .send(buildFindUserCriterias(testE2EFindDummyUserCriterias_User))
      .expect(StatusCodes.NOT_FOUND);
    } else {
      Logger.error('USER(4): (PUT) /findAll - Fetch users based on criterias - cannot test since dummy user creation failed'); 
      Logger.flush();      
    }
  });

  it('USER(5): (PUT) /user/findManyCount - Get count of users meating criterias (not logged in)', () => {
    Logger.error('USER(5): (PUT) /user/findManyCount - Get count of users meating criterias (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/user/findManyCount')
      .send(buildFindUserCriterias(testE2EFindDummyUserCriterias_User))
      .expect(StatusCodes.NOT_FOUND);
    } else {
      Logger.error('USER(5): (PUT) /user/findManyCount - Get count of users meating criterias - cannot test since dummy user creation failed');
      Logger.flush();  
    }
  });

  it('USER(6): (POST) /user/create - Submit a new user (not logged in)', () => {
    Logger.error('USER(6): (POST) /user/create - Submit a new user (not logged in)');
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

  it('USER(7): (PUT) /user/update/:postId - Update a user with :userId (not logged in)', () => {
    Logger.error('USER(7): (PUT) /user/update/:postId - Update a user with :userId (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/user/update/${testE2ENonExistingUserId_User}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('USER(8): (DELETE) /user/delete/:postId - Delete a user (not logged in)', () => {
    Logger.error('USER(8): (DELETE) /user/delete/:postId - Delete a user (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .delete(`/user/delete/${testE2ENonExistingUserId_User}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('USER(9): (GET) /user - Fetch all users (admin logged in)', () => {
    Logger.error('USER(9): (GET) /user - Fetch all users (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
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
    Logger.error('USER(10): (GET) /user - Fetch all users (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(10): (GET) /user - Fetch all users (dummy logged in) - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId (admin logged in)', () => {
    Logger.error('USER(11): (GET) /user/:userId - Fetch a particular user with admin userId (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .get(`/user/${adminUserDtoWithTokens.id}`)
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .expect(adminUserDtoWithTokens)
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
    Logger.error('USER(12): (GET) /user/:userId - Fetch a particular user with dummy userId (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDtoWithTokens.id}`)
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(12): (GET) /user/:userId - Fetch a particular user with dummy userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(13): (POST) /user/create - Submit a new user (dummy logged in)', () => {
    Logger.error('USER(13): (POST) /user/create - Submit a new user (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/create')
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .send(buildCreateUserDto(testE2ECreateUnknownUserDto_User))
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.warn('USER(13): (POST) /user/create - Submit a new user (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(13): (POST) /user/create - Submit a new user (dummy logged in) - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(14): (POST) /user/create - Submit a new user (admin logged in)', () => {
    Logger.error('USER(14): (POST) /user/create - Submit a new user (admin logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .post('/user/create')
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildCreateUserDto(testE2ECreateUnknownUserDto_User))
      .expect(StatusCodes.OK)
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

  it('USER(15): (PUT) /auth/login unknown user (not logged in)', () => {
    Logger.error('USER(15): (PUT) /auth/login unknown user (not logged in)');
    Logger.flush();
    if (unknownUserDto) {
      return request(app.getHttpServer())
      .put('/auth/login')
      .send(buildLoginDto(testE2ELoginUnknownUser_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoWithTokens = response.body)
      .catch(error => {
        Logger.error('USER(15): (PUT) /auth/login unknown user (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(15): (PUT) /auth/login unknown user (not logged in) - cannot test since unknown user creation failed');
      Logger.flush();
    }
  });

  it('USER(16): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (dummy logged in)', () => {
    Logger.error('USER(16): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (dummy logged in)');
    Logger.flush();
    if (unknownUserDto && dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(16): (PUT) /user/update/:postId - Update a user name - cannot test since unknown user or dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(17): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (admin logged in)', () => {
    Logger.error('USER(17): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (admin logged in)');
    Logger.flush();
    if (unknownUserDto && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body)
      .catch(error => {
        Logger.error('USER(17): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(17): (PUT) /user/update/:postId - Update a user name - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(18): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (unknown logged in)', () => {
    Logger.error('USER(18): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (unknown logged in)');
    Logger.flush();
    if (unknownUserDtoWithTokens && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDtoWithTokens.id}`)
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body)
      .catch(error => {
        Logger.error('USER(18): (PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (unknown logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(18): (PUT) /user/update/:postId - Update a user name - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(19): (PUT) /user/find - Fetch a user based on username criteria (dummy logged in)', () => {
    Logger.error('USER(19): (PUT) /user/find - Fetch a user based on username criteria (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put('/user/find')
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildFindUserCriterias(testE2EFindUnknownUserNameCriterias_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body)
      .catch(error => {
        Logger.error('USER(19): (PUT) /user/find - Fetch a user based on username criteria (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(19): (PUT) /user/find - Fetch a user based on username criteria - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(20): (PUT) /user/update/:postId - Update a user password with unknown userId (admin logged in)', () => {
    Logger.error('USER(20): (PUT) /user/update/:postId - Update a user password with unknown userId (admin logged in)');
    Logger.flush();
    if (unknownUserDto && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildUpdateUserDto(testE2EUpdateUnknownUserPasswordDto_User))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoPasswordUpdated = response.body)
      .catch(error => {
        Logger.error('USER(20): (PUT) /user/update/:postId - Update a user password with unknown userId (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(20): (PUT) /user/update/:postId - Update a user password - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });

  it('USER(21): (DELETE) /user/delete/:postId -  Delete a user with unknown userid (dummy logged in)', () => {
    Logger.error('USER(21): (DELETE) /user/delete/:postId -  Delete a user with unknown userid (dummy logged in)');
    Logger.flush();
    if (unknownUserDto && dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDto.id}`)
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('USER(21): (DELETE) /user/delete/:postId - cannot test since unknown user or dummy user creation failed');
      Logger.flush();
    }
  });

  it('USER(22): (DELETE) /user/delete/:postId - Delete a user with unknown userid (admin logged in)', () => {
    Logger.error('USER(22): (DELETE) /user/delete/:postId - Delete a user with unknown userid (admin logged in)');
    Logger.flush();
    if (unknownUserDto && adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDto.id}`)
      .set("Authorization", `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('USER(22): (DELETE) /user/delete/:postId - Delete a user with unknown userid (admin logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('USER(22): (DELETE) /user/delete/:postId - cannot test since unknown user or admin user creation failed');
      Logger.flush();
    }
  });
});
