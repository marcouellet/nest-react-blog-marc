import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata, NotFoundException } from '@nestjs/common';

import { DataModule } from '../../src/modules/data.module';
import { DataModuleStub } from '../stubs/data.module.stub';
import { MongoDataModule } from '../../src/frameworks/data/mongo/mongo-data.module';
import { MongoDataModuleStub } from '../stubs/mongo-data.module.stub';
import { GLOBAL_TEST_CONFIG_SERVICE, GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS } from '../config/config.global';

describe('DataModule', () => {
  let dataModuleMetadata: ModuleMetadata;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();
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
    const app: TestingModule = await Test.createTestingModule({}).compile();
  });

  dataModuleMetadata = DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE);

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
          expect(dataModuleMetadata.imports).toContain(MongoDataModuleStub);
        });
    });
  }

  describe('DataModuleMock register - unknown dataServerName in config', () => {
    it('should throw an exception', () => {
      try {
        const metadata = DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS);
        if (metadata) {
            throw new Error('no exception thrown');
        }
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
