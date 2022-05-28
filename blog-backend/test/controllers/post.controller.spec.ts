import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import { PostService } from '../../src/services/post/post.service';
import { UserService } from '../../src/services/user/user.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';

describe('Post Controller', () => {
  let postController: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService, PostFactoryService, UserService],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('postController should be defined', () => {
    expect(postController).toBeDefined();
  });
});
