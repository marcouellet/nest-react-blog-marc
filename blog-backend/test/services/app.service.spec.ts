import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from 'services/app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
      }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('appService should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getServerInfo', () => {
    it('should return "Marc Nest Blog API"', async () => {
      expect(appService.getServerInfo()).toStrictEqual('Marc Nest Blog API');
    });
  });
});

