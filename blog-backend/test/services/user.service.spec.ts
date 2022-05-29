import { Test, TestingModule } from '@nestjs/testing';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { GetConfigMock } from '../mock/config/config.mock';
import { UserService } from '../../src/services/user/user.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { CryptographerService } from '../../src/services/cryptographer.service';
import { IDataRepositories } from '../../src/core/abstracts';
import { DataRepositoryFactory } from '../mock/data/factories/data-repository.factory';
import sinon from 'ts-sinon';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [UserService, UserFactoryService, CryptographerService,
        // {
        //   provide: IDataRepositories,
        //   useFactory:
        //     () => new DataRepositoryFactory(sinon.mock(User), sinon.mock(Model<PostDocument>)); 
        // },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });
});
