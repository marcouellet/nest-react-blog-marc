import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import UserServiceProvider from '../providers/user.service.provider';
import PostServiceProvider from '../providers/post.service.provider';
import PostFactoryServiceProvider from '../providers/post.factory.service.provider';
import { testPostDto, testCreatePostDto, testUpdatePostDto } from '../data/post.data';

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

  describe('getAll', () => {
    it('should return an array containing one post"', async () => {
      expect(await postController.getAll()).toStrictEqual([testPostDto]);
    });
  });

  describe('getPost', () => {
    it('should return a post"', async () => {
      expect(await postController.getPost('1')).toStrictEqual(testPostDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1"', async () => {
      expect(await postController.getNumberOfPostsForUser('1')).toStrictEqual(1);
    });
  });

  describe('createPost', () => {
    it('should return a post"', async () => {
      expect(await postController.createPost(testCreatePostDto)).toStrictEqual(testPostDto);
    });
  });

  describe('updatePost', () => {
    it('should return a post"', async () => {
      expect(await postController.updatePost('1', testUpdatePostDto)).toStrictEqual(testPostDto);
    });
  });

  describe('deletePost', () => {
    it('should return a post"', async () => {
      expect(await postController.deletePost('1')).toStrictEqual(testPostDto);
    });
  });

});
