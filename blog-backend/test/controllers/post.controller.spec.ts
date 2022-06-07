import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import UserServiceMock from '../mock/user.service.mock';
import PostServiceMock from '../mock/post.service.mock';
import { testPostId, testServicePostDto, testServicePostCount, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../data/post.data';

describe('Post Controller', () => {
  let postController: PostController;
  let userService: UserService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostServiceMock, UserServiceMock],
    }).compile();

    postController = module.get<PostController>(PostController);
    userService = module.get<UserService>(UserService);
    postService = module.get<PostService>(PostService);
  });

  it('postController should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one post"', async () => {
      expect(await postController.getAll()).toStrictEqual([testServicePostDto]);
      expect(postService.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('getPost', () => {
    it('should return a post"', async () => {
      expect(await postController.getPost(testPostId)).toStrictEqual(testServicePostDto);
      expect(postService.getPostById).toHaveBeenCalled();
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.getNumberOfPostsForUser(testPostId)).toStrictEqual(testServicePostCount);
      expect(postService.getNumberOfPostsForUser).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should return a post"', async () => {
      expect(await postController.createPost(testCreatePostDto)).toStrictEqual(testServicePostDto);
      expect(userService.getUserById).toHaveBeenCalled();
      expect(postService.createPost).toHaveBeenCalled();
    });
  });

  describe('finPost', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testFindPostCriterias)).toStrictEqual(testServicePostDto);
      expect(postService.findPost).toHaveBeenCalled();
    });
  });

  describe('finManyPosts', () => {
    it('should return an array of one post"', async () => {
      expect(await postController.finManyPosts(testFindPostCriterias)).toStrictEqual([testServicePostDto]);
      expect(postService.findManyPosts).toHaveBeenCalled();
    });
  });

  describe('finManyPostsCount', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.findManyPostsCount(testFindPostCriterias)).toStrictEqual(testServicePostCount);
      expect(postService.findManyPostsCount).toHaveBeenCalled();
    });
  });

  describe('updatePost', () => {
    it('should return a post"', async () => {
      expect(await postController.updatePost(testPostId, testUpdatePostDto)).toStrictEqual(testServicePostDto);
      expect(postService.updatePost).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should return a post"', async () => {
      expect(await postController.deletePost(testPostId)).toStrictEqual(testServicePostDto);
      expect(postService.deletePost).toHaveBeenCalled();
    });
  });
});
