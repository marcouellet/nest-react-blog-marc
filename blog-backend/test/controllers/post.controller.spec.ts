import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../../src/controllers/post.controller';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import UserServiceMock from '../mocks/user.service.mock';
import PostServiceMock from '../mocks/post.service.mock';
import { testPostId, testServicePostDto, testPostCount, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../data/post.data';

describe('Post Controller', () => {
  let postController: PostController;
  let userServiceMock: UserService;
  let postServiceMock: PostService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostServiceMock, UserServiceMock],
    }).compile();

    postController = module.get<PostController>(PostController);
    userServiceMock = module.get<UserService>(UserService);
    postServiceMock = module.get<PostService>(PostService);
  });

  it('postController should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('userService should be defined', () => {
    expect(userServiceMock).toBeDefined();
  });

  it('postService should be defined', () => {
    expect(postServiceMock).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array containing one post"', async () => {
      expect(await postController.getAll()).toStrictEqual([testServicePostDto]);
      expect(postServiceMock.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('getPost', () => {
    it('should return a post"', async () => {
      expect(await postController.getPost(testPostId)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.getPostById).toHaveBeenCalled();
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.getNumberOfPostsForUser(testPostId)).toStrictEqual(testPostCount);
      expect(postServiceMock.getNumberOfPostsForUser).toHaveBeenCalled();
    });
  });

  describe('createPost', () => {
    it('should return a post"', async () => {
      expect(await postController.createPost(testCreatePostDto)).toStrictEqual(testServicePostDto);
      expect(userServiceMock.getUserById).toHaveBeenCalled();
      expect(postServiceMock.createPost).toHaveBeenCalled();
    });
  });

  describe('finPost', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testFindPostCriterias)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.findPost).toHaveBeenCalled();
    });
  });

  describe('finManyPosts', () => {
    it('should return an array of one post"', async () => {
      expect(await postController.finManyPosts(testFindPostCriterias)).toStrictEqual([testServicePostDto]);
      expect(postServiceMock.findManyPosts).toHaveBeenCalled();
    });
  });

  describe('finManyPostsCount', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.findManyPostsCount(testFindPostCriterias)).toStrictEqual(testPostCount);
      expect(postServiceMock.findManyPostsCount).toHaveBeenCalled();
    });
  });

  describe('updatePost', () => {
    it('should return a post"', async () => {
      expect(await postController.updatePost(testPostId, testUpdatePostDto)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.updatePost).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should return a post"', async () => {
      expect(await postController.deletePost(testPostId)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.deletePost).toHaveBeenCalled();
    });
  });
});
