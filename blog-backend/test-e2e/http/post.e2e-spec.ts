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
import { PostDatabaseBuilder } from '../database/post.database';
import { testE2ERegisterAdminUser_Post, testE2ERegisterDummyUser_Post, testE2ENonExistingUserFindPostCriterias_Post,
        testE2ENonExistingPostId_Post, testE2EDummyUserCreatePostDto_Post, testE2EDummyUserUpdatePostDto_Post,
        testE2EDummyUserFindUpdatedPostCriterias_Post, testE2ELoginDummyUser_Post } from '../data/post.data';
import { PostDto, UserDto } from '../../src/core';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let dummyUserDto: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let adminUserDto: UserDto;
  let dummyUserPostDto: PostDto;
  let dummyUserUpdatedPostDto: PostDto;
 
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
    postDatabaseBuilder = new PostDatabaseBuilder(userService, postService);

    // Remove test data in database

    await postDatabaseBuilder.deleteAllPostsForE2EUsers();
    await postDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterAdminUser_Post);
    } catch (error) {
      Logger.error(error);
    }

    try {
      dummyUserDto = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Post);
    } catch (error) {
      Logger.error(error);
    }
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('(GET) /post - Fetch all posts (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/post')
      .expect(StatusCodes.OK);
  })

  it('(GET) /post/:postId - Fetch a particular post with an non existing post id (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/post/${testE2ENonExistingPostId_Post}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(GET) /post/count/:userId - Get number of posts owned by user with dummy userId (not logged in)', () => {
    if (dummyUserDto) {
    return request(app.getHttpServer())
      .get(`/post/count/${dummyUserDto.id}`)
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(GET) /post/count/:userId - cannot test since dummy user creation failed');      
    }
  });

  it('(PUT) /post/find - Fetch a post based on criterias with no match (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/find')
      .send(JSON.stringify(testE2ENonExistingUserFindPostCriterias_Post))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findAll - Fetch posts based on criterias with no match (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findAll')
      .send(JSON.stringify(testE2ENonExistingUserFindPostCriterias_Post))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findManyCount - Get count of posts meating criterias no patch (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(JSON.stringify(testE2ENonExistingUserFindPostCriterias_Post))
      .expect(StatusCodes.OK);
  });

  it('(POST) /post/create - Submit a new post (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/post/create')
      .send(JSON.stringify(testE2EDummyUserCreatePostDto_Post))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /post/update/:postId - Update a post (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/post/update/${testE2ENonExistingPostId_Post}`)
      .send(JSON.stringify(testE2EDummyUserUpdatePostDto_Post))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /post/delete/:postId - Delete a post (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/post/delete/${testE2ENonExistingPostId_Post}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /auth/login dummy user (not logged in)', () => {
    if (dummyUserDto) {
      return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(testE2ELoginDummyUser_Post))
      .expect(StatusCodes.OK)
      .then(response => dummyUserDtoWithTokens = response.body);
    } else {
      Logger.error('(PUT) /auth/login dummy user (not logged in) - cannot test since dummy user creation failed');      
    }
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(POST) /post/create - Submit a new post (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
      let post = { ... testE2EDummyUserCreatePostDto_Post };
      post.user = dummyUserDto;
      return request(app.getHttpServer())
        .post('/post/create')
        .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
        .send(JSON.stringify(post))
        .expect(StatusCodes.OK)
        .then(response => dummyUserPostDto = response.body);
    } else {
      Logger.error('(POST) /post/create - Submit a new post - cannot test since dummy user creation failed');
    }
  });

  it('(PUT) /post/update/:postId - Update a post (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
        .put(`/post/update/${dummyUserPostDto.id}`)
        .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
        .send(JSON.stringify(testE2EDummyUserUpdatePostDto_Post))
        .expect(StatusCodes.OK)
        .then(response => dummyUserUpdatedPostDto = response.body);
    } else {
      Logger.error('(PUT) /post/update/:postId - Update a post - cannot test since dummy user creation failed');
    }
  });

  it('(PUT) /post/find - Fetch a post based on criterias (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/post/find')
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .send(JSON.stringify(testE2EDummyUserFindUpdatedPostCriterias_Post))
      .expect(StatusCodes.OK);
    } else {
      Logger.error('(PUT) /post/find - Fetch a post based on criterias - cannot test since dummy user creation failed');
    }
  });

  it('(DELETE) /post/delete/:postId - Delete a post (dummy logged in)', () => {
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .delete(`/post/delete/${dummyUserPostDto.id}`)
      .set("authorization", dummyUserDtoWithTokens.authtoken.accessToken)
      .expect(StatusCodes.OK)
      .expect(dummyUserUpdatedPostDto);
    } else {
      Logger.error('(DELETE) /post/delete/:postId - Delete a post - cannot test since dummy user creation failed');
    }
  });
});
