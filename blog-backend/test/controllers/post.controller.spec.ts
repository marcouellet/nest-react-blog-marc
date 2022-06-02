import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import UserServiceProvider from '../providers/user.service.provider';
import PostServiceProvider from '../providers/post.service.provider';
import { testPostId, testServicePostDto, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../data/post.data';

describe('Post Controller', () => {
  let postController: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostServiceProvider, UserServiceProvider],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('postController should be defined', () => {
    expect(postController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one post"', async () => {
      expect(await postController.getAll()).toStrictEqual([testServicePostDto]);
    });
  });

  describe('getPost', () => {
    it('should return a post"', async () => {
      expect(await postController.getPost(testPostId)).toStrictEqual(testServicePostDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1"', async () => {
      expect(await postController.getNumberOfPostsForUser(testPostId)).toStrictEqual(1);
    });
  });

  describe('createPost', () => {
    it('should return a post"', async () => {
      expect(await postController.createPost(testCreatePostDto)).toStrictEqual(testServicePostDto);
    });
  });

  describe('finPost', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testFindPostCriterias)).toStrictEqual(testServicePostDto);
    });
  });

  describe('finManyUsers', () => {
    it('should return an array of one user"', async () => {
      expect(await postController.finManyPosts(testFindPostCriterias)).toStrictEqual([testServicePostDto]);
    });
  });

  describe('updatePost', () => {
    it('should return a post"', async () => {
      expect(await postController.updatePost(testPostId, testUpdatePostDto)).toStrictEqual(testServicePostDto);
    });
  });

  describe('deletePost', () => {
    it('should return a post"', async () => {
      expect(await postController.deletePost(testPostId)).toStrictEqual(testServicePostDto);
    });
  });
});
