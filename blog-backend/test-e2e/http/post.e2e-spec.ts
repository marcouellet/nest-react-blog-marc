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
import { buildCreateCategoryDto } from '../../test/builders/category.dtos.builders';
import { testE2ECreateCategoryDto_Category } from '../data/category.data';
import { testE2ERegisterDummyUser_Post, testE2ENonExistingUserFindPostCriterias_Post,testE2EWithNotPartOfUpdatedTitleFindPostCriterias,
        testE2ENonExistingPostId_Post, testE2EDummyUserCreatePostDto_Post, testE2EDummyUserUpdateWithoutCategoryPostDto_Post,
        testE2ELoginDummyUser_Post, testCategoryPostsCount, testE2EWithPartOfUpdatedTitleFindPostCriterias,
        testE2ENonExistingCategoryId_Post, testPostCount, testE2ERegisterAdminUser_Post, testE2EWithTitleFindPostCriterias,
        testE2EmptyPostFilterCriterias, testE2EWithPartOfTitleFindPostCriterias, testE2EWithUpdatedTitleFindPostCriterias,
        testE2EWithNotPartOfTitleFindPostCriterias, testWithTitleFilterFindCriterias } from '../data/post.data';
import { PostDto, UserDto, CategoryDto } from '../../src/core';
import { CustomLogger } from '../../src/common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let postDatabaseBuilder: PostDatabaseBuilder;
  let adminUserDtoWithTokens: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let dummyUserPostDto: PostDto;
  let dummyUserUpdatedPostDto: PostDto;
  let createdCategoryDto: CategoryDto;

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

    authService = appModule.get<AuthService>(AuthService);

    if (!authService) {
      Logger.error('POST: authService not found');
      Logger.flush();
    }

    userService = appModule.get<UserService>(UserService);
    if (!userService) {
      Logger.error('POST: userService not found');
      Logger.flush();
    }

    postService = appModule.get<PostService>(PostService);

    if (!postService) {
      Logger.error('POST: postService not found');
      Logger.flush();
    }

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    postDatabaseBuilder = new PostDatabaseBuilder(userService, postService);

    // Remove test data in database

    await postDatabaseBuilder.deleteAllPostsForE2EUsers();
    await postDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUserAsAdmin(testE2ERegisterAdminUser_Post);
    } catch (error) {
      Logger.error('USER: admin user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Post);
    } catch (error) {
      Logger.error('POST: dummy user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  });

  afterAll(async () => {
    await postDatabaseBuilder.deleteAllPostsForE2EUsers();
    await postDatabaseBuilder.deleteAllE2EUsers();
    await app.close();
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
  });

  it('POST(2): (GET) /post/:postId - Fetch a particular post with an non existing post id (not logged in)', () => {
    Logger.debug('POST(2): (GET) /post/:postId - Fetch a particular post with an non existing post id (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get(`/post/${testE2ENonExistingPostId_Post}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('POST(3): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (not logged in)', () => {
    Logger.debug('POST(3): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/user/${dummyUserDtoWithTokens.id}`)
      .expect(StatusCodes.OK)
      .expect(response => response === null) // No post created yet
      .catch(error => {
        Logger.error('POST(3): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(3): (GET) /post/count/user/:userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(3a): (GET) /post/user/category/:userId - Get number of posts using a category with dummy userId (not logged in)', () => {
    Logger.debug('POST(3a): (GET) /post/user/category/:userId - Get number of posts using a category with dummy userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/category/${testE2ENonExistingCategoryId_Post}`)
      .expect(StatusCodes.OK)
      .expect(response => response === null) // No post created yet
      .catch(error => {
        Logger.error('POST(3a): (GET) /post/category/:userId - Get number of posts using a category with dummy userId (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(3a): (GET) /post/user/category/:userId - cannot test since dummy user creation failed');
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

  it('POST(5): (PUT) /post/findMany - Fetch posts based on criterias with no match (not logged in)', () => {
    Logger.debug('POST(5): (PUT) /post/findMany - Fetch posts based on criterias with no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testE2ENonExistingUserFindPostCriterias_Post)
      .expect(StatusCodes.OK)
      .expect(response => response === null)
      .catch(error => {
        Logger.error('POST(5): (PUT) /post/findMany - Fetch posts based on criterias with no match (not logged in) failed, see following error message:');
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
      .expect(response => response === null)
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
      .send(buildUpdatePostDto(testE2EDummyUserUpdateWithoutCategoryPostDto_Post))
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
      .then(response => response && (dummyUserDtoWithTokens = response.body))
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

  it('CATEGORY(11): (POST) /category/create - Submit a new category (dummy logged in)', () => {
    Logger.debug('POST(11): (POST) /category/create - Submit a new category (dummy logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens) {
      const post = buildCreateCategoryDto(testE2ECreateCategoryDto_Category);
      return request(app.getHttpServer())
        .post('/category/create')
        .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
        .send(post)
        .expect(StatusCodes.CREATED)
        .then(response => response && (createdCategoryDto = response.body))
        .catch(error => {
          Logger.warn('POST(11): (POST) /category/create - Submit a new category failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('POST(11): (POST) /category/create - Submit a new category - cannot test since admin user creation failed');
      Logger.flush();
    }
  });

  it('POST(12): (POST) /post/create - Submit a new post with a category (dummy logged in)', () => {
    Logger.debug('POST(12): (POST) /post/create - Submit a new post with a category (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && createdCategoryDto) {
      const post = buildCreatePostDto(testE2EDummyUserCreatePostDto_Post);
      post.user = dummyUserDtoWithTokens;
      post.category = createdCategoryDto;
      return request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
        .send(post)
        .expect(StatusCodes.CREATED)
        .then(response => response && (dummyUserPostDto = response.body))
        .catch(error => {
          Logger.warn('POST(12): (POST) /post/create - Submit a new post failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('POST(12): (POST) /post/create - Submit a new post - cannot test since dummy user creation or category creation failed');
      Logger.flush();
    }
  });

  it('POST(12a): (GET) /post/count/category/:categoryId - Get number of posts using a category with dummy userId (not logged in)', () => {
    Logger.debug('POST(12a): (GET) /post/count/category/:categoryId - Get number of posts using a category with dummy userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/category/${createdCategoryDto.id}`)
      .expect(StatusCodes.OK)
      .expect(response => response.body === testCategoryPostsCount) // Should be 1
      .catch(error => {
        Logger.error('POST(12a): (GET) /post/count/category/:userId - Get number of posts using a category with dummy userId (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(12a): (GET) /post/count/category/:userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(12b): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (logged not required)', () => {
    Logger.debug('POST(12b): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (logged not required)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/user/${dummyUserDtoWithTokens.id}`)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === testPostCount) // Should be 1
      .catch(error => {
        Logger.error('POST(12b): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(12b): (GET) /post/count/user/:userId - Get number of posts owned by user with dummy userId (logged not required) - '
       + 'cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(12c): (PUT) /post/findMany/category/:categoryId without filter - Fetch posts based on category (logged not required)', () => {
    Logger.debug('POST(12c): (PUT) /post/findMany/category/:categoryId without filter - Fetch posts based on category criteria (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/category/${createdCategoryDto.id}`)
      .send(testE2EmptyPostFilterCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [createdCategoryDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(12c): (PUT) /post/findMany/category/:categoryId without filter - Fetch posts based on category (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(12d): (PUT) /post/findMany/category/:categoryId with title filter - Fetch posts based on category (logged not required)', () => {
    Logger.debug('POST(12d): (PUT) /post/findMany/category/:categoryId with title filter - Fetch posts based on category criteria (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/category/${createdCategoryDto.id}`)
      .send(testE2EWithTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [createdCategoryDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(12d): (PUT) /post/findMany/category/:categoryId with title filter - Fetch posts based on category (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(12e): (PUT) /post/findMany/category/:categoryId with part of title filter - Fetch posts based on category (logged not required)', () => {
    Logger.debug('POST(12e): (PUT) /post/findMany/category/:categoryId with part of title filter - Fetch posts based on category criteria (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/category/${createdCategoryDto.id}`)
      .send(testE2EWithPartOfTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [createdCategoryDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(12e): (PUT) /post/findMany/category/:categoryId with part of title filter - Fetch posts based on category (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(12f): (PUT) /post/findMany/category/:categoryId with no part of title filter - Fetch posts based on category (logged not required)', () => {
    Logger.debug('POST(12f): (PUT) /post/findMany/category/:categoryId with part of title filter - Fetch posts based on category criteria (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/category/${createdCategoryDto.id}`)
      .send(testE2EWithNotPartOfTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === []) // Should return no post
      .catch(error => {
        Logger.error('POST(12f): (PUT) /post/findMany/category/:categoryId with no part of title filter - Fetch posts based on category (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(12g): (PUT) /post/findMany/nocategory without filter - Fetch posts without category without filter (logged not required)', () => {
    Logger.debug('POST(12g): (PUT) /post/findMany/nocategory without filter - Fetch posts without category without filter (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory}`)
      .send(testE2EmptyPostFilterCriterias)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('POST(12h): (PUT) /post/findMany/user/:userId - Fetch posts for a user (logged not required)', () => {
    Logger.debug('POST(12h): (PUT) /post/findMany/user/:userId - Fetch posts for a user (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/user/${dummyUserDtoWithTokens.id}`)
      .send(testE2EmptyPostFilterCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [createdCategoryDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(12h): (PUT)/post/findMany/user/:userId - Fetch posts for a user (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(13): (PUT) /post/update/:postId - Update a post with no category (dummy logged in)', () => {
    Logger.debug('POST(13): (PUT) /post/update/:postId - Update a post (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && dummyUserPostDto) {
      return request(app.getHttpServer())
        .put(`/post/update/${dummyUserPostDto.id}`)
        .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
        .send(buildUpdatePostDto(testE2EDummyUserUpdateWithoutCategoryPostDto_Post))
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

  it('POST(13a): (GET) /post/count/category/:categoryId - Get number of posts using no category with dummy userId (not logged in)', () => {
    Logger.debug('POST(13a): (GET) /post/count/category/:categoryId - Get number of posts using no category with dummy userId (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .get(`/post/count/category/${createdCategoryDto.id}`)
      .expect(StatusCodes.OK)
      .expect(response => response.body === 0) // Should be 0
      .catch(error => {
        Logger.error('POST(13a): (GET) /post/count/category/:userId - Get number of posts using no category with dummy userId (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(13a): (GET) /post/count/category/:userId - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('POST(14): (PUT) /post/find - Fetch a post based on post criterias (dummy logged in)', () => {
    Logger.debug('POST(14): (PUT) /post/find - Fetch a post based on post criterias (dummy logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/find')
      .send(testE2EWithUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === dummyUserUpdatedPostDto) // Should return one post
      .catch(error => {
        Logger.error('POST(14): (PUT) /post/find - Fetch a post based on criterias (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(14a): (PUT) /post/find - Fetch a post based on filter criterias (dummy logged in)', () => {
    Logger.debug('POST(14a): (PUT) /post/find - Fetch a post based on filter criterias (dummy logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/find')
      .send(testWithTitleFilterFindCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === dummyUserUpdatedPostDto) // Should return one post
      .catch(error => {
        Logger.error('POST(14a): (PUT) /post/find - Fetch a post based on filter criterias (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(15): (PUT) /post/findMany with no filter - Fetch posts based on title criteria (not logged in)', () => {
    Logger.debug('POST(15): (PUT) /post/findMany with no filter - Fetch posts based on title criteria (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testE2EmptyPostFilterCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(15): (PUT) /post/findMany with no filter - Fetch posts based on title criteria (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(15a): (PUT) /post/findMany with title filter - Fetch posts based on title criteria (not logged in)', () => {
    Logger.debug('POST(15a): (PUT) /post/findMany with title filter - Fetch posts based on title criteria (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testE2EWithUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(15a): (PUT) /post/findMany with title filter - Fetch posts based on title criteria (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(15b): (PUT) /post/findMany with part of title filter - Fetch posts based on title criteria (not logged in)', () => {
    Logger.debug('POST(15b): (PUT) /post/findMany with title filter - Fetch posts based on title criteria (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testE2EWithPartOfTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(15b): (PUT) /post/findMany with part of title filter - Fetch posts based on title criteria (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(15c): (PUT) /post/findMany with no part of title filter - Fetch posts based on title criteria (not logged in)', () => {
    Logger.debug('POST(15c): (PUT) /post/findMany with title filter - Fetch posts based on title criteria (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testE2EWithNotPartOfTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === []) // Should return no post
      .catch(error => {
        Logger.error('POST(15c): (PUT) /post/findMany with no part of title filter - Fetch posts based on title criteria (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(15d): (PUT) /post/findMany with filter criterias on title - Fetch posts based on title criteria (not logged in)', () => {
    Logger.debug('POST(15d): (PUT) /post/findMany with  filter criterias on title - Fetch posts based on title criteria (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findMany')
      .send(testWithTitleFilterFindCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should return one post
      .catch(error => {
        Logger.error('POST(15d): (PUT) /post/findMany with  filter criterias on title - Fetch posts based on title criteria (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(16): (PUT) /post/findManyCount - Get count of posts meating post criteria on title (not logged in)', () => {
    Logger.debug('POST(16): (PUT) /post/findManyCount - Get count of posts meating post criteria on title (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(testE2EWithUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === testPostCount) // should be 1
      .catch(error => {
        Logger.error('POST(16): (PUT) /post/findManyCount - Get count of posts meating post criteria on title (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(16a): (PUT) /post/findManyCount - Get count of posts meating filter criteria on title (not logged in)', () => {
    Logger.debug('POST(16a): (PUT) /post/findManyCount - Get count of posts meating filter criteria on title (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(testWithTitleFilterFindCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === testPostCount) // should be 1
      .catch(error => {
        Logger.error('POST(16a): (PUT) /post/findManyCount - Get count of posts meating filter criteria on title (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(17): (PUT) /post/findMany/nocategory - Fetch posts without category without filter (logged not required)', () => {
    Logger.debug('POST(17): (PUT) /post/findMany/nocategory - Fetch posts without category without filter (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory`)
      .send(testE2EmptyPostFilterCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should be 1 post found
      .catch(error => {
        Logger.error('POST(17): (PUT) /post/findMany/nocategory - Fetch posts without category without filter (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(17a): (PUT) /post/findMany/nocategory - Fetch posts without category with updated title filter (logged not required)', () => {
    Logger.debug('POST(17a): (PUT) /post/findMany/nocategory - Fetch posts without category with updated title filter (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory`)
      .send(testE2EWithUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should be 1 post found
      .catch(error => {
        Logger.error('POST(17a): (PUT) /post/findMany/nocategory - Fetch posts without category with updated title filter (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(17b): (PUT) /post/findMany/nocategory - Fetch posts without category with part of updated title filter (logged not required)', () => {
    Logger.debug('POST(17b): (PUT) /post/findMany/nocategory - Fetch posts without category with updated title filter (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory`)
      .send(testE2EWithPartOfUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should be 1 post found
      .catch(error => {
        Logger.error('POST(17b): (PUT) /post/findMany/nocategory - Fetch posts without category with part of updated title filter (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(17c): (PUT) /post/findMany/nocategory - Fetch posts without category with no part of updated title filter (logged not required)', () => {
    Logger.debug('POST(17c): (PUT) /post/findMany/nocategory - Fetch posts without category with no part of updated title filter (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory`)
      .send(testE2EWithNotPartOfUpdatedTitleFindPostCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === []) // Shouldtryurn no post
      .catch(error => {
        Logger.error('POST(17c): (PUT) /post/findMany/nocategory - Fetch posts without category with no part of updated title filter (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(17d): (PUT) /post/findMany/nocategory - Fetch posts without category with filter criterias on title (logged not required)', () => {
    Logger.debug('POST(17d): (PUT) /post/findMany/nocategory - Fetch posts without category with filter criterias on title (logged not required)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/post/findMany/nocategory`)
      .send(testWithTitleFilterFindCriterias)
      .expect(StatusCodes.OK)
      .expect(response => response && response.body === [dummyUserUpdatedPostDto]) // Should be 1 post found
      .catch(error => {
        Logger.error('POST(17d): (PUT) /post/findMany/nocategory - Fetch posts without category with filter criterias on title (logged not required) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('POST(18): (DELETE) /post/delete/:postId - Delete a post (dummy logged in)', () => {
    Logger.debug('POST(18): (DELETE) /post/delete/:postId - Delete a post (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && dummyUserUpdatedPostDto) {
    return request(app.getHttpServer())
      .delete(`/post/delete/${dummyUserUpdatedPostDto.id}`)
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .expect(dummyUserUpdatedPostDto)
      .catch(error => {
        Logger.error('POST(18): (DELETE) /post/delete/:postId - Delete a post (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('POST(18): (DELETE) /post/delete/:postId - Delete a post - cannot test since dummy user creation failed or post update failed');
      Logger.flush();
    }
  });
});
