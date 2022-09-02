import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from 'services/api/config.service';

import { IConfigService } from '../../src/config/interfaces/config.interface';
import { testOkConfigOptions, testUnknownDataServerNameConfigOptions, testUnknownAuthStrategyNameConfigOptions } from '../data/config.data';

describe('ConfigService - ok.env', () => {
  let configService: IConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IConfigService,
          useValue: new ConfigService(testOkConfigOptions),
        },
      ],
    }).compile();

    configService = module.get<IConfigService>(IConfigService);
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return a config', async () => {
      const config = configService.getConfig();
      expect(config.dataServerName).toStrictEqual('MONGODB');
    });
  });
});

describe('ConfigService - unknown data server name', () => {
  let configService: IConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IConfigService,
          useValue: new ConfigService(testUnknownDataServerNameConfigOptions),
        },
      ],
    }).compile();

    configService = module.get<IConfigService>(IConfigService);
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('getConfig', () => {
    it('should throw an exception', async () => {
      let config: any;
      try {
        config = configService.getConfig();
        if (config) {
            throw new Error('no exception thrown');
        }
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

describe('ConfigService - unknown auth strategy name', () => {
  let configService: IConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IConfigService,
          useValue: new ConfigService(testUnknownAuthStrategyNameConfigOptions),
        },
      ],
    }).compile();

    configService = module.get<IConfigService>(IConfigService);
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('getConfig', () => {
    it('should throw an exception', async () => {
      let config: any;
      try {
        config = configService.getConfig();
        if (config) {
            throw new Error('no exception thrown');
        }
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
