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
    it('should return an array containing one post"', () => {
      expect(postController.getAll()).toBe([testPostDto]);
    });
  });

  describe('getPost', () => {
    it('should return a post"', () => {
      expect(postController.getPost('1')).toBe([testPostDto]);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1"', () => {
      expect(postController.getNumberOfPostsForUser('1')).toBe(1);
    });
  });

  describe('createPost', () => {
    it('should return a post"', () => {
      expect(postController.createPost(testCreatePostDto)).toBe(testPostDto);
    });
  });

  describe('updatePost', () => {
    it('should return a post"', () => {
      expect(postController.updatePost('1', testUpdatePostDto)).toBe(1);
    });
  });

  describe('deletePost', () => {
    it('should return a post"', () => {
      expect(postController.deletePost('1')).toBe(testPostDto);
    });
  });

});
