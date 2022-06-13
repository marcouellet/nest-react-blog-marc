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
import { testE2EUnknownUserFindUpdatedPostCriterias, testE2EUnknownUserFindPostCriterias,
          testE2EUnknownUserCreatePostDto, testE2EUnknownUserUpdatePostDto } from '../data/post.data';
import { PostDto, UserDto } from '../../src/core';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let userDatabaseBuilder: UserDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let dummyUserDto: UserDto;
  let adminUserDto: UserDto;
  let unknownUserPostDto: PostDto;
  let unknownUserUpdatedPostDto: PostDto;

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

  it('(GET) /post - Fetch all posts (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/post')
      .expect(StatusCodes.OK);
  })

  it('(GET) /post/:userId - Fetch a particular post for user with an unknown id (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/post/${'unknown-id'}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(GET) /post/count/:userId - Get number of posts owned by user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/post/count/${'unknown-id'}`)
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/find - Fetch a post based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/find')
      .send(JSON.stringify(testE2EUnknownUserFindPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findAll - Fetch posts based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findAll')
      .send(JSON.stringify(testE2EUnknownUserFindPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findManyCount - Get count of posts meating criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(JSON.stringify(testE2EUnknownUserFindPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(POST) /post/create - Submit a new post (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/post/create')
      .send(JSON.stringify(testE2EUnknownUserCreatePostDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /post/update/:postId - Update a post (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/post/update/${'unknown-id'}`)
      .send(JSON.stringify(testE2EUnknownUserUpdatePostDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /post/delete/:postId - Delete a post (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/post/delete/${'unknown-id'}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(POST) /post/create - Submit a new post (logged in)', () => {
    return request(app.getHttpServer())
      .post('/post/create')
      .send(JSON.stringify(testE2EUnknownUserCreatePostDto))
      .expect(StatusCodes.OK)
      .then(response => unknownUserPostDto = response.body);
  });

  it('(PUT) /post/update/:postId - Update a post (logged in)', () => {
    return request(app.getHttpServer())
      .put(`/post/update/${unknownUserPostDto.id}`)
      .send(JSON.stringify(testE2EUnknownUserUpdatePostDto))
      .expect(StatusCodes.OK)
      .then(response => unknownUserUpdatedPostDto = response.body);
  });

  it('(PUT) /post/find - Fetch a post based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/find')
      .send(JSON.stringify(testE2EUnknownUserFindUpdatedPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(DELETE) /post/delete/:postId - Delete a post (logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/post/delete/${unknownUserPostDto.id}`)
      .expect(StatusCodes.OK)
      .expect(unknownUserUpdatedPostDto);
  });
});
