import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@Modules/app.module';
import { AuthService } from 'services/api/auth.service';
import { UserService } from 'services/api/user/user.service';
import { PostService } from 'services/api/post/post.service';
import { CategoryService } from 'services/api/category/category.service';
import { CategoryDto, UserDto } from '@Shared/dtos';
import { buildCreateCategoryDto, buildUpdateCategoryDto } from '@Shared/builders/category.dtos.builders';

import { StatusCodes } from 'http-status-codes';
import { AuthDatabaseBuilder } from '../database/auth.database';
import { CategoryDatabaseBuilder } from '../database/category.database';
import { testE2ERegisterDummyUser_Category, testE2EFindCategoryNonExistingTitleCriterias_Category,
        testE2ENonExistingCategoryId_Category, testE2ECreateCategoryDto_Category, testE2EUpdateCategoryTitleDto_Category,
        testE2EFindUpdatedCategoryTitleCriterias_Category, testE2ERegisterAdminUser_Category } from '../data/category.data';
import { CustomLogger } from '../../src/common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;
  let postService: PostService;
  let categoryService: CategoryService;
  let authDatabaseBuilder: AuthDatabaseBuilder;
  let categoryDatabaseBuilder: CategoryDatabaseBuilder;
  let adminUserDtoWithTokens: UserDto;
  let dummyUserDtoWithTokens: UserDto;
  let createdCategoryDto: CategoryDto;
  let updatedCategoryDto: CategoryDto;

  CustomLogger.setGlobalPrefix('Category Controller E2E Tests');

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
      Logger.error('CATEGORY: authService not found');
      Logger.flush();
    }

    userService = appModule.get<UserService>(UserService);

    if (!userService) {
      Logger.error('CATEGORY: userService not found');
      Logger.flush();
    }

    postService = appModule.get<PostService>(PostService);

    if (!postService) {
      Logger.error('CATEGORY: postService not found');
      Logger.flush();
    }

    categoryService = appModule.get<CategoryService>(CategoryService);

    if (!categoryService) {
      Logger.error('CATEGORY: categoryService not found');
      Logger.flush();
    }

    authDatabaseBuilder = new AuthDatabaseBuilder(userService, authService);
    categoryDatabaseBuilder = new CategoryDatabaseBuilder(userService, postService, categoryService);

    // Remove test data in database

    await categoryDatabaseBuilder.deleteAllPostsForE2EUsers();
    await categoryDatabaseBuilder.deleteAllCategorysForE2EUsers();
    await categoryDatabaseBuilder.deleteAllE2EUsers();

    // Create test data in database

    try {
      adminUserDtoWithTokens = await authDatabaseBuilder.registerUserAsAdmin(testE2ERegisterAdminUser_Category);
    } catch (error) {
      Logger.error('CATEGORY: admin user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }

    try {
      dummyUserDtoWithTokens = await authDatabaseBuilder.registerUser(testE2ERegisterDummyUser_Category);
    } catch (error) {
      Logger.error('CATEGORY: dummy user registration failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  });

  afterAll(async () => {
    await categoryDatabaseBuilder.deleteAllPostsForE2EUsers();
    await categoryDatabaseBuilder.deleteAllCategorysForE2EUsers();
    await categoryDatabaseBuilder.deleteAllE2EUsers();
    await app.close();
  });

  //
  // Tests when user is not logged in (authorization token not provided)
  //

  it('CATEGORY(1): (GET) /category - Fetch all categories (not logged in)', () => {
    Logger.debug('CATEGORY(1): (GET) /category - Fetch all categories (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get('/category')
      .expect(StatusCodes.OK)
      .catch(error => {
        Logger.error('CATEGORY(1): (GET) /category - Fetch all categories (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(2): (GET) /category/:categoryId - Fetch a particular category with an non existing category id (not logged in)', () => {
    Logger.debug('CATEGORY(2): (GET) /category/:categoryId - Fetch a particular category with an non existing category id (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .get(`/category/${testE2ENonExistingCategoryId_Category}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('CATEGORY(3): (POST) /category/find - Fetch a category based on criterias with no match (not logged in)', () => {
    Logger.debug('CATEGORY(3): (POST) /category/find - Fetch a category based on criterias with no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/find')
      .send(testE2EFindCategoryNonExistingTitleCriterias_Category)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('CATEGORY(4): (POST) /category/findMany - Fetch categories based on criterias with no match (not logged in)', () => {
    Logger.debug('CATEGORY(4): (POST) /category/findMany - Fetch categories based on criterias with no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/findMany')
      .send(testE2EFindCategoryNonExistingTitleCriterias_Category)
      .expect(StatusCodes.CREATED)
      .expect(response => response === null)
      .catch(error => {
        Logger.error('CATEGORY(4): (POST) /category/findMany - Fetch categories based on criterias with no match (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(5): (POST) /category/findManyCount - Get count of categories meating criterias no match (not logged in)', () => {
    Logger.debug('CATEGORY(5): (POST) /category/findManyCount - Get count of categories meating criterias no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/findManyCount')
      .send(testE2EFindCategoryNonExistingTitleCriterias_Category)
      .expect(StatusCodes.CREATED)
      .expect(response => response === null)
      .catch(error => {
        Logger.error('CATEGORY(5): (POST) /category/findManyCount - Get count of categories meating criterias no match (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(6): (POST) /category/create - Submit a new category (not logged in)', () => {
    Logger.debug('CATEGORY(6): (POST) /category/create - Submit a new category (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/create')
      .send(buildCreateCategoryDto(testE2ECreateCategoryDto_Category))
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.error('CATEGORY(6): (POST) /category/create - Submit a new category (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(7): (PUT) /category/update/:categoryId - Update a category (not logged in)', () => {
    Logger.debug('CATEGORY(): (PUT) /category/update/:postId - Update a category (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .put(`/category/update/${testE2ENonExistingCategoryId_Category}`)
      .send(buildUpdateCategoryDto(testE2EUpdateCategoryTitleDto_Category))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('CATEGORY(8): (DELETE) /category/delete/:categoryId - Delete a category (not logged in)', () => {
    Logger.debug('CATEGORY(8): (DELETE) /category/delete/:postId - Delete a category (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .delete(`/category/delete/${testE2ENonExistingCategoryId_Category}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('CATEGORY(9): (POST) /category/create - Submit a new category (dummy logged in)', () => {
    Logger.debug('CATEGORY(9): (POST) /category/create - Submit a new category (not logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens) {
    return request(app.getHttpServer())
      .post('/category/create')
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .send(buildCreateCategoryDto(testE2ECreateCategoryDto_Category))
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.error('CATEGORY(9): (POST) /category/create - Submit a new category (dummy logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
      Logger.error('CATEGORY(9): (POST) /category/create - Submit a new category - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('CATEGORY(10): (POST) /category/create - Submit a new category (dummy logged in)', () => {
    Logger.debug('CATEGORY(10): (POST) /category/create - Submit a new category (dummy logged in)');
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
          Logger.warn('CATEGORY(10): (POST) /category/create - Submit a new category failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('CATEGORY(10): (POST) /category/create - Submit a new category - cannot test since admin user creation failed');
      Logger.flush();
    }
  });

  it('CATEGORY(11): (PUT) /category/update/:categoryId - Update a category (dummy logged in)', () => {
    Logger.debug('CATEGORY(11): (PUT) /category/update/:categoryId - Update a category (dummy logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens && createdCategoryDto) {
      return request(app.getHttpServer())
        .put(`/category/update/${createdCategoryDto.id}`)
        .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
        .send(buildUpdateCategoryDto(testE2EUpdateCategoryTitleDto_Category))
        .expect(StatusCodes.OK)
        .then(response => response && (updatedCategoryDto = response.body))
        .catch(error => {
          Logger.error('CATEGORY(11): (PUT) /category/update/:categoryId - Update a category (dummy logged in) failed, see following error message:');
          Logger.error(error);
          Logger.flush();
        });
    } else {
      Logger.error('CATEGORY(11): (PUT) /category/update/:categoryId - Update a category - cannot test since dummy user creation failed');
      Logger.flush();
    }
  });

  it('CATEGORY(12): (POST) /category/find - Fetch a category based on criterias (not logged in)', () => {
    Logger.debug('CATEGORY(12): (POST) /category/find - Fetch a category based on criterias (dummy logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/find')
      .send(testE2EFindUpdatedCategoryTitleCriterias_Category)
      .expect(StatusCodes.CREATED)
      .expect(response => response && response.body === updatedCategoryDto)
      .catch(error => {
        Logger.error('CATEGORY(12): (POST) /category/find - Fetch a category based on criterias (not logged in) failed,'
        + 'see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(13): (POST) /category/findMany - Fetch categories based on criterias  (not logged in)', () => {
    Logger.debug('CATEGORY(13): (POST) /category/findMany - Fetch categories based on criterias  (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/findMany')
      .send(testE2EFindCategoryNonExistingTitleCriterias_Category)
      .expect(StatusCodes.CREATED)
      .expect(response => response && response.body === [updatedCategoryDto])
      .catch(error => {
        Logger.error('CATEGORY(13): (POST) /category/findMany - Fetch categories based on criterias with no match (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(14): (POST) /category/findManyCount - Get count of categories meating criterias (not logged in)', () => {
    Logger.debug('CATEGORY(14): (POST) /category/findManyCount - Get count of categories meating criterias no match (not logged in)');
    Logger.flush();
    return request(app.getHttpServer())
      .post('/category/findManyCount')
      .send(testE2EFindCategoryNonExistingTitleCriterias_Category)
      .expect(StatusCodes.CREATED)
      .expect(response => response && response.body === '1')
      .catch(error => {
        Logger.error('CATEGORY(14): (POST) /category/findManyCount - Get count of categories meating criterias (not logged in) failed, see following error message:');
        Logger.error(error);
        Logger.flush();
      });
  });

  it('CATEGORY(15): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in)', () => {
    Logger.debug('CATEGORY(15): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in)');
    Logger.flush();
    if (dummyUserDtoWithTokens && updatedCategoryDto) {
    return request(app.getHttpServer())
      .delete(`/category/delete/${updatedCategoryDto.id}`)
      .set('Authorization', `Bearer ${dummyUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.UNAUTHORIZED)
      .catch(error => {
        Logger.error('CATEGORY(15): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in) failed,'
        + ' see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
        Logger.error('CATEGORY(15): (DELETE) /category/delete/:categoryId - Delete a category - cannot test since dummy user creation failed or post update failed');
        Logger.flush();
    }
  });

  it('CATEGORY(16): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in)', () => {
    Logger.debug('CATEGORY(16): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in)');
    Logger.flush();
    if (adminUserDtoWithTokens && updatedCategoryDto) {
    return request(app.getHttpServer())
      .delete(`/category/delete/${updatedCategoryDto.id}`)
      .set('Authorization', `Bearer ${adminUserDtoWithTokens.authtoken.accessToken}`)
      .expect(StatusCodes.OK)
      .expect(updatedCategoryDto)
      .catch(error => {
        Logger.error('CATEGORY(16): (DELETE) /category/delete/:categoryId - Delete a category (dummy logged in) failed,'
        + ' see following error message:');
        Logger.error(error);
        Logger.flush();
      });
    } else {
        Logger.error('CATEGORY(16): (DELETE) /category/delete/:categoryId - Delete a category - cannot test since dummy user creation failed or post update failed');
        Logger.flush();
    }
  });
});
