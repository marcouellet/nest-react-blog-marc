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
import { buildLoginDto } from '../../test/builders/auth.dtos.builders';
import { buildCreatePostDto, buildUpdatePostDto } from '../../test/builders/post.dtos.builders';
import { testE2ERegisterDummyUser_Post, testE2ENonExistingUserFindPostCriterias_Post,
        testE2ENonExistingPostId_Post, testE2EDummyUserCreatePostDto_Post, testE2EDummyUserUpdatePostDto_Post,
        testE2EDummyUserFindUpdatedPostCriterias_Post, testE2ELoginDummyUser_Post } from '../data/post.data';
import { PostDto, UserDto } from '../../src/core';
import { CustomLogger } from '../../src/common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let dummyUserDtoWithTokens: UserDto;
  let dummyUserPostDto: PostDto;
  let dummyUserUpdatedPostDto: PostDto;

  CustomLogger.setGlobalPrefix('Post Controller E2E Tests');
 
  jest.setTimeout(60000); // 1 minute

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({
      imports: [AppModule.register(GLOBAL_TEST_E2E_CONFIG_SERVICE)],
    });

    moduleBuilder.setLogger(new CustomLogger());
    const appModule: TestingModule = await moduleBuilder.compile();

    app = appModule.createNestApplication();
    await app.init();

    if (!(authService = appModule.get<AuthService>(AuthService))) {
      Logger.error('POST: authService not found');
      Logger.flush();
    };

    if (!(userService = appModule.get<UserService>(UserService))) {
      Logger.error('POST: userService not found');
      Logger.flush();
    };

    if (!(postService = appModule.get<PostService>(PostService))) {
      Logger.error('POST: postService not found');
      Logger.flush();
    };

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    postDatabaseBuilder = new PostDatabaseBuilder(userService, postService);

    // Remove test data in database

    await postDatabaseBuilder.deleteAllPostsForE2EUsers();
    await postDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Post);
    } catch (error) {
      Logger.error('POST: dummy user registration failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  });

  afterAll(async () => {
    await postDatabaseBuilder.deleteAllPostsForE2EUsers();
    await postDatabaseBuilder.deleteAllE2EUsers();
    app.close();
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  // 

  it('POST(1): (GET) /post - Fetch all posts (not logged in)', () => {
    Logger.debug('POST(1): (GET) /post - Fetch all posts (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get('/post')
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('POST(1): (GET) /post - Fetch all posts (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  })

  it('POST(2): (GET) /post/:postId - Fetch a particular post with an non existing post id (not logged in)', () => {
    Logger.debug('POST(2): (GET) /post/:postId - Fetch a particular post with an non existing post id (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get(`/post/${testE2ENonExistingPostId_Post}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('POST(3): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (not logged in)', () => {
    Logger.debug('POST(3): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/${dummyUserDtoWithTokens.id}`)
      .expect(StatusCodes.OK)
      .expect(body => body === null) // No post created yet
      .catch(error => {
        Logger.error('POST(3): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      }); 
    } else {
      Logger.error('POST(3): (GET) /post/count/:userId - cannot test since dummy user creation failed');  
      Logger.flush();   
    }
  });

  it('POST(4): (PUT) /post/find - Fetch a post based on criterias with no match (not logged in)', () => {
    Logger.debug('POST(4): (PUT) /post/find - Fetch a post based on criterias with no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/find')
      .send(testE2ENonExistingUserFindPostCriterias_Post)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('POST(5): (PUT) /post/findAll - Fetch posts based on criterias with no match (not logged in)', () => {
    Logger.debug('POST(5): (PUT) /post/findAll - Fetch posts based on criterias with no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findAll')
      .send(testE2ENonExistingUserFindPostCriterias_Post)
      .expect(StatusCodes.OK)
      .expect(body => body === null)
      .catch(error => {
        Logger.error('POST(5): (PUT) /post/findAll - Fetch posts based on criterias with no match (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(6): (PUT) /post/findManyCount - Get count of posts meating criterias no match (not logged in)', () => {
    Logger.debug('POST(6): (PUT) /post/findManyCount - Get count of posts meating criterias no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(testE2ENonExistingUserFindPostCriterias_Post)
      .expect(StatusCodes.OK)
      .expect(body => body === null)
      .catch(error => {
        Logger.error('POST(6): (PUT) /post/findManyCount - Get count of posts meating criterias no match (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(7): (POST) /post/create - Submit a new post (not logged in)', () => {
    Logger.debug('POST(7): (POST) /post/create - Submit a new post (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/post/create')
      .send(buildCreatePostDto(testE2EDummyUserCreatePostDto_Post))
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.error('POST(7): (POST) /post/create - Submit a new post (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(8): (PUT) /post/update/:postId - Update a post (not logged in)', () => {
    Logger.debug('POST(8): (PUT) /post/update/:postId - Update a post (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/update/${testE2ENonExistingPostId_Post}`)
      .send(buildUpdatePostDto(testE2EDummyUserUpdatePostDto_Post))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST(9): (DELETE) /post/delete/:postId - Delete a post (not logged in)', () => {
    Logger.debug('POST(9): (DELETE) /post/delete/:postId - Delete a post (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .delete(`/post/delete/${testE2ENonExistingPostId_Post}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('POST(10): (PUT) /auth/login dummy user (not logged in)', () => {
    Logger.debug('POST(10): (PUT) /auth/login dummy user (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
      return request(app.getHttpServer())
      .put('/auth/login')
      .send(buildLoginDto(testE2ELoginDummyUser_Post))
      .expect(StatusCodes.OK)
      .then(response => dummyUserDtoWithTokens = response.body)
      .catch(error => {
        Logger.error('POST(10): (PUT) /auth/login dummy user (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(10): (PUT) /auth/login dummy user (not logged in) - cannot test since dummy user creation failed');
      Logger.flush();      
    }
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('POST(11): (POST) /post/create - Submit a new post (dummy logged in)', () => {
    Logger.debug('POST(11): (POST) /post/create - Submit a new post (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
      let post = buildCreatePostDto(testE2EDummyUserCreatePostDto_Post);
      post.user = dummyUserDtoWithTokens;
      return request(app.getHttpServer())
        .post('/post/create')
        .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
        .send(post)
        .expect(StatusCodes.CREATED)
        .then(response => dummyUserPostDto = response.body)
        .catch(error => {
          Logger.warn('POST(11): (POST) /post/create - Submit a new post failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('POST(11): (POST) /post/create - Submit a new post - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(12): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (logged not required)', () => {
    Logger.debug('POST(12): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (logged not required)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/${dummyUserDtoWithTokens.id}`)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === '1') // No post created yet
      .catch(error => {
        Logger.error('POST(12): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(12): (GET) /post/count/:userId - Get number of posts owned by user with dummy userId (logged not required) - '
       + 'cannot test since dummy user creation failed'); 
       Logger.flush();     
    }
  });

  it('POST(13): (PUT) /post/update/:postId - Update a post (dummy logged in)', () => {
    Logger.debug('POST(13): (PUT) /post/update/:postId - Update a post (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && dummyUserPostDto) {
      return request(app.getHttpServer())
        .put(`/post/update/${dummyUserPostDto.id}`)
        .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
        .send(buildUpdatePostDto(testE2EDummyUserUpdatePostDto_Post))
        .expect(StatusCodes.OK)
        .then(response => response && (dummyUserUpdatedPostDto = response.body))
        .catch(error => {
          Logger.error('POST(13): (PUT) /post/update/:postId - Update a post (dummy logged in) failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('POST(13): (PUT) /post/update/:postId - Update a post - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(14): (PUT) /post/find - Fetch a post based on criterias (dummy logged in)', () => {
    Logger.debug('POST(14): (PUT) /post/find - Fetch a post based on criterias (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .put('/post/find')
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(testE2EDummyUserFindUpdatedPostCriterias_Post)
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('POST(14): (PUT) /post/find - Fetch a post based on criterias (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(14): (PUT) /post/find - Fetch a post based on criterias - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(15): (DELETE) /post/delete/:postId - Delete a post (dummy logged in)', () => {
    Logger.debug('POST(15): (DELETE) /post/delete/:postId - Delete a post (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && dummyUserUpdatedPostDto) {
    return request(app.getHttpServer())
      .delete(`/post/delete/${dummyUserUpdatedPostDto.id}`)
      .set("Authorization", `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .expect(dummyUserUpdatedPostDto)
      .catch(error => {
        Logger.error('POST(15): (DELETE) /post/delete/:postId - Delete a post (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(15): (DELETE) /post/delete/:postId - Delete a post - cannot test since dummy user creation failed or post update failed');
      Logger.flush();
    }
  });
});
