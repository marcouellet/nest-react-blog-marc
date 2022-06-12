import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { testUserId, testCreateUnknownUserDto, testUpdateUserDto, testFindUserCriterias, testUserUnrestricted,
  testUserCount } from '../../test/data/user.data';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
    return request(app.getHttpServer())
      .get(`/user/${testUserId}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /user/find - Fetch a user based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/find')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /findAll - Fetch users based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findAll')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /user/findManyCount - Get count of users meating criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findManyCount')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(POST) /user/create - Submit a new user (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(JSON.stringify(testCreateUnknownUserDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /user/update/:postId - Update a user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/user/update/${testUserId}`)
      .send(JSON.stringify(testUpdateUserDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /user/delete/:postId - Delete a user (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/user/delete/${testUserId}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(GET) /user - Fetch all users (logged in)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(StatusCodes.OK)
      .expect([testUserUnrestricted]);
  });

  it('(GET) /user/:userId - Fetch a particular user with :userId (logged in)', () => {
    return request(app.getHttpServer())
      .get(`/user/${testUserId}`)
      .expect(StatusCodes.OK)
      .expect(testUserUnrestricted);
  });

  it('(PUT) /user/find - Fetch a user based on criterias (logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/find')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.OK)
      .expect(testUserUnrestricted);
  });

  it('(PUT) /findAll - Fetch users based on criterias (logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findAll')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.OK)
      .expect([testUserUnrestricted]);
  });

  it('(PUT) /user/findManyCount - Get count of users meating criterias (logged in)', () => {
    return request(app.getHttpServer())
      .put('/user/findManyCount')
      .send(JSON.stringify(testFindUserCriterias))
      .expect(StatusCodes.OK)
      .expect(testUserCount);
  });

  it('(POST) /user/create - Submit a new user (logged in)', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(JSON.stringify(testCreateUnknownUserDto))
      .expect(StatusCodes.OK)
      .expect(testUserUnrestricted);
  });

  it('(PUT) /user/update/:postId - Update a user with :userId (logged in)', () => {
    return request(app.getHttpServer())
      .put(`/user/update/${testUserId}`)
      .send(JSON.stringify(testUpdateUserDto))
      .expect(StatusCodes.OK)
      .expect(testUserUnrestricted);
  });

  it('(DELETE) /user/delete/:postId - Delete a user (logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/user/delete/${testUserId}`)
      .expect(StatusCodes.OK)
      .expect(testUserUnrestricted);
  });
});
