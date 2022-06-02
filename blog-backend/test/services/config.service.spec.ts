import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../src/services/config.service';
import { testServiceConfig } from '../data/config.data';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return a config', async () => {
      expect(configService.getConfig()).toEqual(testServiceConfig);
    });
  });
});
