import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/controllers/app.controller';
import { AppService } from '../../src/services/app.service';
import AppServiceProvider from '../providers/app.service.provider';
import { testServerInfo } from '../data/app.data';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceProvider],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('appController should be defined', () => {
      expect(appController).toBeDefined();
  });

  it('appService should be defined', () => {
      expect(appService).toBeDefined();
  });

  describe('root', () => {
    it('should return "Marc Nest Blog API"', () => {
      expect(appController.getServerInfo()).toStrictEqual(testServerInfo);
      expect(appService.getServerInfo).toHaveBeenCalled();
    });
  });
});
