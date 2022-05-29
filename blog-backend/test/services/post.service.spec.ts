import { Test, TestingModule } from '@nestjs/testing';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { GetConfigMock } from '../mock/config/config.mock';
import { PostService } from '../../src/services/post/post.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { IDataRepositories } from '../../src/core/abstracts';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [PostService, PostFactoryService
        {provide: IDataRepositories,
          useValue:}
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });
});
