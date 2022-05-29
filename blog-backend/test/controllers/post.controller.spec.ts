import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import UserServiceProvider from '../providers/user.service.provider';
import PostServiceProvider from '../providers/post.service.provider';
import PostFactoryServiceProvider from '../providers/post.factory.service.provider';

describe('Post Controller', () => {
  let postController: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostServiceProvider, PostFactoryServiceProvider, UserServiceProvider],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('postController should be defined', () => {
    expect(postController).toBeDefined();
  });
});
