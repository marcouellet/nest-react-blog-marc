import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { AppModule } from '../../src/modules/app.module';
import { UserService } from '../../src/services/user/user.service';
import { testJwtPayload, testLoginDto, testRegisterUnknownUserDto } from '../../test/data/auth.data';
import { testUserDto, testUserUnknownDto} from '../../test/data/user.data';

let auth: { token: string; };
auth.token = 'token';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = app.get<UserService>(UserService);

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

  it('(PUT) /auth/login (not logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/login')
      .send(JSON.stringify(testLoginDto))
      .expect(StatusCodes.OK)
      .expect(testUserDto);
  });

  it('(POST) /auth/register  (not logged in)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(JSON.stringify(testRegisterUnknownUserDto))
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

  it('(GET) /auth/whoami (logged in)', () => {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set("authorization", auth.token)
      .expect(StatusCodes.OK)
      .expect(testJwtPayload);
  });

  it('(PUT) /auth/refresh (logged in)', () => {
    return request(app.getHttpServer())
      .put('/auth/refresh')
      .expect(StatusCodes.OK)
      .expect(testUserDto);
  });
});
