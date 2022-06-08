import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/controllers/app.controller';
import { AppService } from '../../src/services/app.service';
import AppServiceMock from '../mocks/app.service.mock';
import { testServerInfo } from '../data/app.data';

describe('AppController', () => {
  let appController: AppController;
  let appServiceMock: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceMock],
    }).compile();

    appController = app.get<AppController>(AppController);
    appServiceMock = app.get<AppService>(AppService);
  });

  it('appController should be defined', () => {
      expect(appController).toBeDefined();
  });

  it('appService should be defined', () => {
      expect(appServiceMock).toBeDefined();
  });

  describe('root', () => {
    it('should return testServerInfo', () => {
      expect(appController.getServerInfo()).toStrictEqual(testServerInfo);
      expect(appServiceMock.getServerInfo).toHaveBeenCalled();
    });
  });
});
