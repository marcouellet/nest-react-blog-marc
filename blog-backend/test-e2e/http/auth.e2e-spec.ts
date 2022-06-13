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
import { testE2ELoginAdminUser, testE2ELoginDummyUser, testE2ERegisterAdminUser, testE2ERegisterDummyUser,
          testE2ERegisterUnknownUser, testE2EDummyUserJwtPayload } from '../data/auth.data';
import { testUserDto, testUserUnknownDto} from '../../test/data/user.data';
import { UserDto } from '../../src/core';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let dummyUserDto: UserDto;
  let adminUserDto: UserDto;

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
    } catch (error) {
      
    }

    try {
      adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser);
    } catch (error) {
      
    }

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
      .send(JSON.stringify(testE2ELoginAdminUser))
      .expect(StatusCodes.OK)
      .expect(testUserDto);
  });

  it('(PUT) /auth/login dummy user (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(testE2ELoginDummyUser))
      .expect(StatusCodes.OK)
      .expect(testUserDto);
  });

  it('(POST) /auth/register existing user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(JSON.stringify(testE2ERegisterAdminUser))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(POST) /auth/register unknown user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(JSON.stringify(testE2ERegisterUnknownUser))
      .expect(StatusCodes.OK)
      .expect(testUserUnknownDto);
  });

  it('(PUT) /auth/refresh (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(GET) /auth/whoami dummy user (logged in)', () => {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set("authorization", dummyUserDto.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(testE2EDummyUserJwtPayload);
  });

  it('(PUT) /auth/refresh admin user (logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .set("authorization", adminUserDto.authtoken.accessToken)
      .expect(StatusCodes.OK);
  });
});
