import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '../../src/modules/config.module';
import { DataModule } from '../../src/modules/data.module';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { MongoDataModule } from '../../src/frameworks/data/mongo/mongo-data.module';
import { MongoDataModuleMock } from '../mock/data/mongo/mongo-data.module.mock';
import { GLOBAL_TEST_CONFIG_SERVICE, GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS } from '../config/config.global';

describe('DataModule', () => {
  let dataModuleMetadata: ModuleMetadata;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
          ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
    }).compile();
  });

  dataModuleMetadata = DataModule.register(GLOBAL_TEST_CONFIG_SERVICE);

  it('dataModuleMetadata should be defined', () => {
    expect(dataModuleMetadata).toBeDefined();
  });

  describe('dataModuleMetadata', () => {
    it('modules property imports should be defined', () => {
      expect(dataModuleMetadata.imports).toBeDefined();
    });
  });

  if (dataModuleMetadata.imports) {
    describe('dataModuleMetadata', () => {
        it('modules property should contain MongoDataModule', () => {
          expect(dataModuleMetadata.imports).toContain(MongoDataModule);
        });
    });
  }

  describe('DataModule register - unknown dataServerName in config', () => {
    it('should throw an exception', () => {
      try {
        const metadata = DataModule.register(GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS);
        if (metadata) {
            throw new Error('no exception thrown');
        }
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

describe('DataModuleMock', () => {
  let dataModuleMetadata: ModuleMetadata;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
          ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
    }).compile();
  });

  dataModuleMetadata = DataModuleMock.register(GLOBAL_TEST_CONFIG_SERVICE);

  it('dataModuleMetadata should be defined', () => {
    expect(dataModuleMetadata).toBeDefined();
  });

  describe('dataModuleMetadata', () => {
    it('modules property imports should be defined', () => {
      expect(dataModuleMetadata.imports).toBeDefined();
    });
  });

  if (dataModuleMetadata.imports) {
    describe('dataModuleMetadata', () => {
        it('modules property should contain MongoDataModuleMock', () => {
          expect(dataModuleMetadata.imports).toContain(MongoDataModuleMock);
        });
    });
  }

  describe('DataModuleMock register - unknown dataServerName in config', () => {
    it('should throw an exception', () => {
      try {
        const metadata = DataModuleMock.register(GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS);
        if (metadata) {
            throw new Error('no exception thrown');
        }
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
