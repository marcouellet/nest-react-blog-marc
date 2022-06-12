import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { testPostId, testServicePostDto, testPostCount, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../../test/data/post.data';
import { testUserId } from '../../test/data/user.data';

describe('PostController (e2e)', () => {
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

  it('(GET) /post - Fetch all posts (not logged in)', () => {
    return request(app.getHttpServer())
      .get('/post')
      .expect(StatusCodes.OK);
  })

  it('(GET) /post/:userId - Fetch a particular post for user with an unknown id (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/post/${testPostId}`)
      .expect(StatusCodes.NOT_FOUND);
  });

  it('(GET) /post/count/:userId - Get number of posts owned by user with :userId (not logged in)', () => {
    return request(app.getHttpServer())
      .get(`/post/count/${testUserId}`)
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/find - Fetch a post based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/find')
      .send(JSON.stringify(testServicePostDto))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findAll - Fetch posts based on criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findAll')
      .send(JSON.stringify(testFindPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(PUT) /post/findManyCount - Get count of posts meating criterias (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/post/findManyCount')
      .send(JSON.stringify(testFindPostCriterias))
      .expect(StatusCodes.OK);
  });

  it('(POST) /post/create - Submit a new post (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/post/create')
      .send(JSON.stringify(testCreatePostDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(PUT) /post/update/:postId - Update a post (not logged in)', () => {
    return request(app.getHttpServer())
      .put(`/post/update/${testPostId}`)
      .send(JSON.stringify(testUpdatePostDto))
      .expect(StatusCodes.UNAUTHORIZED);
  });

  it('(DELETE) /post/delete/:postId - Delete a post (not logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/post/delete/${testPostId}`)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  //
  // Test when user is logged in (authorization token provided)
  //

  it('(POST) /post/create - Submit a new post (logged in)', () => {
    return request(app.getHttpServer())
      .post('/post/create')
      .send(JSON.stringify(testCreatePostDto))
      .expect(StatusCodes.OK)
      .expect(testServicePostDto);
  });

  it('(PUT) /post/update/:postId - Update a post (logged in)', () => {
    return request(app.getHttpServer())
      .put(`/post/update/${testPostId}`)
      .send(JSON.stringify(testUpdatePostDto))
      .expect(StatusCodes.OK)
      .expect(testServicePostDto);
  });

  it('(DELETE) /post/delete/:postId - Delete a post (logged in)', () => {
    return request(app.getHttpServer())
      .delete(`/post/delete/${testPostId}`)
      .expect(StatusCodes.OK)
      .expect(testServicePostDto);
  });
});
