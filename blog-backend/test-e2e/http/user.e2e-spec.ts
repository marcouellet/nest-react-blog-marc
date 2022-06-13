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
import { PostDatabaseBuilder } from '../database/post.database';
import { testE2ERegisterAdminUser, testE2ERegisterDummyUser } from '../data/auth.data';
import { testE2EFindDummyUserCriterias, testE2ECreateUnknownUserDto, testE2EUpdateUnknownUserNameDto,
          testE2EFindUnknownUserNameCriterias, testE2EUpdateUnknownUserPasswordDto } from '../data/user.data';
import { UserDto } from '../../src/core';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let dummyUserDto: UserDto;
  let adminUserDto: UserDto;
  let unknownUserDto: UserDto;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = appModule.get<AuthService>(AuthService);
    userService = appModule.get<UserService>(UserService);
    postService = appModule.get<PostService>(PostService);

    it('authService should be defined', () => {
      expect(authService).toBeDefined();
    });
  
    it('userService should be defined', () => {
      expect(userService).toBeDefined();
    });
  
    it('postService should be defined', () => {
      expect(postService).toBeDefined();
    });

    authDatabaseBuilder = new AuthDatabaseBuilder(authService);
    userDatabaseBuilder = new UserDatabaseBuilder(userService);
    postDatabaseBuilder = new PostDatabaseBuilder(postService);

    // Remove test data in database

    postDatabaseBuilder.deleteAllPostsForE2EUsers();
    userDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
    dummyUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser);
    } catch (error) {}

    try {
    adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser);
    } catch (error) {}

    app = appModule.createNestApplication();
    await app.init();
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('(GET) /user - Fetch all users (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.OK);
  });

  it('(GET) /user/:userId - Fetch a particular user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/user/${dummyUserDto.id}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(PUT) /user/find - Fetch a user based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/find')
      .send(JSON.stringify(testE2EFindDummyUserCriterias))
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(PUT) /findAll - Fetch users based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findAll')
      .send(JSON.stringify(testE2EFindDummyUserCriterias))
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(PUT) /user/findManyCount - Get count of users meating criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findManyCount')
      .send(JSON.stringify(testE2EFindDummyUserCriterias))
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(POST) /user/create - Submit a new user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(JSON.stringify(testE2ECreateUnknownUserDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /user/update/:postId - Update a user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/user/update/${'unknown-id'}`)
      .send(JSON.stringify(testE2EUpdateUnknownUserNameDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /user/delete/:postId - Delete a user (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/user/delete/${'unknown-id'}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(GET) /user - Fetch all users (logged in)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.OK);
  });

  it('(GET) /user/:userId - Fetch a particular user with :userId (logged in)', () => {
    return request(app.getHttpServer())
      .get(`/user/${adminUserDto.id}`)
      .expect(StatusCodes.OK)
      .expect(adminUserDto);
  });

  it('(POST) /user/create - Submit a new user (logged in)', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(JSON.stringify(testE2ECreateUnknownUserDto))
      .expect(StatusCodes.OK)
      .then(response => unknownUserDto = response.body);
  });

  it('(PUT) /user/update/:postId - Update a user name (unknown) with :userId (logged in)', () => {
    if (unknownUserDto) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .send(JSON.stringify(testE2EUpdateUnknownUserNameDto))
      .expect(StatusCodes.OK)
      .expect(unknownUserDto);
    } else {
      console.log('(PUT) /user/update/:postId - cannot test since unknown user creation failed')
    }
  });

  it('(PUT) /user/find - Fetch a user based on username criteria (logged in)', () => {
    if (unknownUserDto) {
      return request(app.getHttpServer())
      .put('/user/find')
      .send(JSON.stringify(testE2EFindUnknownUserNameCriterias))
      .expect(StatusCodes.OK);
    } else {
      console.log('(PUT) /user/find based on user name - cannot test since unknown user creation failed')
    }
  });

  it('(PUT) /user/update/:postId - Update a user password (unknown) with :userId (logged in)', () => {
    if (unknownUserDto) {
      return request(app.getHttpServer())
      .put(`/user/update/${unknownUserDto.id}`)
      .send(JSON.stringify(testE2EUpdateUnknownUserPasswordDto))
      .expect(StatusCodes.OK);
    } else {
      console.log('(PUT) /user/update/:postId - Update a user password - cannot test since unknown user creation failed')
    }
  });

  it('(DELETE) /user/delete/:postId - Delete a user (unknown) (logged in)', () => {
    if (unknownUserDto) {
    return request(app.getHttpServer())
      .delete(`/user/delete/${unknownUserDto.id}`)
      .expect(StatusCodes.OK)
      .expect(unknownUserDto);
    } else {
      console.log('(DELETE) /user/delete/:postId - cannot test since unknown user creation failed')
    }
  });
});
