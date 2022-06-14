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
        testE2ENonExistingUserId_User, testE2EUpdateUnknownUserPasswordDto_User, testE2ELoginDummyUser_User,
        testE2ELoginAdminUser_User } from '../data/user.data';
import { UserDto } from '../../src/core';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let dummyUserDto: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let adminUserDto: UserDto;
  let adminUserDtoWithTokens: UserDto;
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

    if (!(authService = appModule.get<AuthService>(AuthService))) {
      Logger.error('authService not found');
    };

    if (!(userService = appModule.get<UserService>(UserService))) {
      Logger.error('userService not found');
    };

    if (!(postService = appModule.get<PostService>(PostService))) {
      Logger.error('postService not found');
    };

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    userDatabaseBuilder = new UserDatabaseBuilder(userService, postService);

    // Remove test data in database

     await userDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_User);
    } catch (error) {
      Logger.error(error);
    }

    try {
      dummyUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_User);
    } catch (error) {
      Logger.error(error);
    }
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('(GET) /user - Fetch all users (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(GET) /user/:userId - Fetch a particular user with :userId (not logged in)', () => {
    if (dummyUserDto) {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDto.id}`)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(GET) /user/:userId - cannot test since dummy user creation failed');
    }
  });

  it('(PUT) /user/find - Fetch a user based on criterias (not logged in)', () => {
    if (dummyUserDto) { 
    return request(app.getHttpServer())
      .put('/user/find')
      .send(JSON.stringify(buildFindUserCriterias(testE2EFindDummyUserCriterias_User)))
      .expect(StatusCodes.NOT_FOUND);
    } else {
      Logger.error('(PUT) /user/find - Fetch a user based on criterias - cannot test since dummy user creation failed');    
    }
  });

  it('(PUT) /findAll - Fetch users based on criterias (not logged in)', () => {
    if (dummyUserDto) { 
    return request(app.getHttpServer())
      .put('/user/findAll')
      .send(JSON.stringify(buildFindUserCriterias(testE2EFindDummyUserCriterias_User)))
      .expect(StatusCodes.OK)
      .expect(body => body === null);
    } else {
      Logger.error('(PUT) /findAll - Fetch users based on criterias - cannot test since dummy user creation failed');       
    }
  });

  it('(PUT) /user/findManyCount - Get count of users meating criterias (not logged in)', () => {
    if (dummyUserDto) {
    return request(app.getHttpServer())
      .put('/user/findManyCount')
      .send(JSON.stringify(buildFindUserCriterias(testE2EFindDummyUserCriterias_User)))
      .expect(StatusCodes.OK)
      .expect(body => body === null);
    } else {
      Logger.error('(PUT) /user/findManyCount - Get count of users meating criterias - cannot test since dummy user creation failed');  
    }
  });

  it('(POST) /user/create - Submit a new user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(JSON.stringify(buildCreateUserDto(testE2ECreateUnknownUserDto_User)))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /user/update/:postId - Update a user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/user/update/${testE2ENonExistingUserId_User}`)
      .send(JSON.stringify(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User)))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /user/delete/:postId - Delete a user (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/user/delete/${testE2ENonExistingUserId_User}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /auth/login dummy user (not logged in)', () => {
    if (dummyUserDto) {
      return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(buildLoginDto(testE2ELoginDummyUser_User)))
      .expect(StatusCodes.OK)
      .then(response => dummyUserDtoWithTokens = response.body);
    } else {
      Logger.error('(PUT) /auth/login dummy user (not logged in) - cannot test since dummy user creation failed');
    }
  });

  it('(PUT) /auth/login admin user (not logged in)', () => {
    if (adminUserDto) {
      return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(buildLoginDto(testE2ELoginAdminUser_User)))
      .expect(StatusCodes.OK)
      .then(response => adminUserDtoWithTokens = response.body);
    } else {
      Logger.error('(PUT) /auth/login admin user (not logged in) - cannot test since admin user creation failed');
    }
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(GET) /user - Fetch all users (admin logged in)', () => {
    if (adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(GET) /user - Fetch all users (admin logged in) - cannot test since admin user creation failed');
    }
  });

  it('(GET) /user - Fetch all users (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get('/user')
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(GET) /user - Fetch all users (dummy logged in) - cannot test since dummy user creation failed');
    }
  });

  it('(GET) /user/:userId - Fetch a particular user with admin userId (admin logged in)', () => {
    if (adminUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .get(`/user/${adminUserDto.id}`)
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(adminUserDto);
    } else {
      Logger.error('(GET) /user/:userId - Fetch a particular user with admin userId - cannot test since admin user creation failed');
    }
  });

  it('(GET) /user/:userId - Fetch a particular user with dummy userId (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDto.id}`)
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(GET) /user/:userId - Fetch a particular user with dummy userId - cannot test since dummy user creation failed');
    }
  });

  it('(POST) /user/create - Submit a new user (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/user/create')
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildCreateUserDto(testE2ECreateUnknownUserDto_User)))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(POST) /user/create - Submit a new user (dummy logged in) - cannot test since dummy user creation failed');
    }
  });

  it('(POST) /user/create - Submit a new user (admin logged in)', () => {
    if (adminUserDtoWithTokens) { 
    return request(app.getHttpServer())
      .post('/user/create')
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildCreateUserDto(testE2ECreateUnknownUserDto_User)))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDto = response.body);
    } else {
      Logger.error('(POST) /user/create - Submit a new user (admin logged in) - cannot test since admin user creation failed')
    }
  });

  it('(PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (dummy logged in)', () => {
    if (unknownUserDto && dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User)))
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(PUT) /user/update/:postId - Update a user name - cannot test since unknown user or dummy user creation failed')
    }
  });

  it('(PUT) /user/update/:postId - Update a user name (unknown) with unknown userId (admin logged in)', () => {
    if (unknownUserDto && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildUpdateUserDto(testE2EUpdateUnknownUserNameDto_User)))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body);
    } else {
      Logger.error('(PUT) /user/update/:postId - Update a user name - cannot test since unknown user or admin user creation failed')
    }
  });

  it('(PUT) /user/find - Fetch a user based on username criteria (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put('/user/find')
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildFindUserCriterias(testE2EFindUnknownUserNameCriterias_User)))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoNameUpdated = response.body);
    } else {
      Logger.error('(PUT) /user/find - Fetch a user based on username criteria - cannot test since dummy user creation failed')
    }
  });

  it('(PUT) /user/update/:postId - Update a user password with unknown userId (admin logged in)', () => {
    if (unknownUserDto && adminUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(buildUpdateUserDto(testE2EUpdateUnknownUserPasswordDto_User)))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDtoPasswordUpdated = response.body);
    } else {
      Logger.error('(PUT) /user/update/:postId - Update a user password - cannot test since unknown user or admin user creation failed')
    }
  });

  it('(DELETE) /user/delete/:postId -  Delete a user with unknown userid (dummy logged in)', () => {
    if (unknownUserDto && dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDto.id}`)
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.UNAUTHORIZED);
    } else {
      Logger.error('(DELETE) /user/delete/:postId - cannot test since unknown user or dummy user creation failed')
    }
  });

  it('(DELETE) /user/delete/:postId - Delete a user with unknown userid (admin logged in)', () => {
    if (unknownUserDto && adminUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDto.id}`)
      .set("authorization", adminUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(unknownUserDtoPasswordUpdated);
    } else {
      Logger.error('(DELETE) /user/delete/:postId - cannot test since unknown user or admin user creation failed')
    }
  });
});
