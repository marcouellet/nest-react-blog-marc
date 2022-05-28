import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/controllers/app.controller';
import { AppService } from '../../src/services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Marc Nest Blog API"', () => {
      expect(appController.getServerInfo()).toBe('Marc Nest Blog API');
    });
  });
});
