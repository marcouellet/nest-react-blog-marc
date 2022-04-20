import { Test, TestingModule } from '@nestjs/testing';
import { PostServices } from './post-services.service';

describe('PostService', () => {
  let service: PostServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostServices],
    }).compile();

    service = module.get<PostServices>(PostServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
