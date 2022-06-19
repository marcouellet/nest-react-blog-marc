import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { CustomLogger } from '../../src/common/custom.logger';
import { GLOBAL_TEST_E2E_CONFIG_SERVICE } from '../config/config.global';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  CustomLogger.setGlobalPrefix('AppController E2E Tests');

  beforeAll(async () => {

    const moduleBuilder = await Test.createTestingModule({
      imports: [AppModule.register(GLOBAL_TEST_E2E_CONFIG_SERVICE)],
    });

    moduleBuilder.setLogger(new CustomLogger());
    const appModule: TestingModule = await moduleBuilder.compile();

    app = appModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Marc Nest Blog API');
  });
});
