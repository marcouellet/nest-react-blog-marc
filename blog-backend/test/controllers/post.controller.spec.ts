import { Test, TestingModule } from '@nestjs/testing';

import { PostController } from 'controllers/post.controller';
import { UserService } from 'services/user/user.service';
import { PostService } from 'services/post/post.service';
import UserServiceMock from '../mocks/user.service.mock';
import PostServiceMock from '../mocks/post.service.mock';
import { testUserId } from '../data/user.data';
import { testCategoryId } from '../data/category.data';
import { testPostId, testServicePostDto, testPostCount, testCreatePostDto, testUpdatePostDto, testWithTitleFindPostCriterias,
          testServicePostWithoutCategoryDto, testEmptyPostFilterCriterias, testWithTitleFilterFindCriterias } from '../data/post.data';

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
      expect(postServiceMock.getPost).toHaveBeenCalled();
    });
  });

  describe('findManyPostsForUser', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsForUser(testUserId, testEmptyPostFilterCriterias)).toEqual([testServicePostDto]);
      expect(postServiceMock.findManyPostsForUser).toHaveBeenCalledWith(testUserId, testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsForCategory without filter', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsForCategory(testCategoryId, testEmptyPostFilterCriterias)).toEqual([testServicePostDto]);
      expect(postServiceMock.findManyPostsForCategory).toHaveBeenCalledWith(testCategoryId, testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsForCategory with post find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsForCategory(testCategoryId, testWithTitleFindPostCriterias)).toEqual([testServicePostDto]);
      expect(postServiceMock.findManyPostsForCategory).toHaveBeenCalledWith(testCategoryId, testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPostsForCategory with filter find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsForCategory(testCategoryId, testWithTitleFilterFindCriterias)).toEqual([testServicePostDto]);
      expect(postServiceMock.findManyPostsForCategory).toHaveBeenCalledWith(testCategoryId, testWithTitleFilterFindCriterias);
    });
  });

  describe('findManyPostsWithoutCategory without filter', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsWithoutCategory(testEmptyPostFilterCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postServiceMock.findManyPostsWithoutCategory).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsWithoutCategory with post find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsWithoutCategory(testWithTitleFindPostCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postServiceMock.findManyPostsWithoutCategory).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPostsWithoutCategory filter find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postController.finManyPostsWithoutCategory(testWithTitleFilterFindCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postServiceMock.findManyPostsWithoutCategory).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
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
      expect(userServiceMock.getUser).toHaveBeenCalled();
      expect(postServiceMock.createPost).toHaveBeenCalled();
    });
  });

  describe('finPost without filter', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testEmptyPostFilterCriterias)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.findPost).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('finPost with post find criterias for title', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testWithTitleFindPostCriterias)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.findPost).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('finPost with filter find criterias for title', () => {
    it('should return a post"', async () => {
      expect(await postController.finPost(testWithTitleFilterFindCriterias)).toStrictEqual(testServicePostDto);
      expect(postServiceMock.findPost).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
    });
  });

  describe('finManyPosts without filter', () => {
    it('should return an array of one post"', async () => {
      expect(await postController.finManyPosts(testEmptyPostFilterCriterias)).toStrictEqual([testServicePostDto]);
      expect(postServiceMock.findManyPosts).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('finManyPosts with post find criterias for title', () => {
    it('should return an array of one post"', async () => {
      expect(await postController.finManyPosts(testWithTitleFindPostCriterias)).toStrictEqual([testServicePostDto]);
      expect(postServiceMock.findManyPosts).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('finManyPosts with filter find criterias for title', () => {
    it('should return an array of one post"', async () => {
      expect(await postController.finManyPosts(testWithTitleFilterFindCriterias)).toStrictEqual([testServicePostDto]);
      expect(postServiceMock.findManyPosts).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
    });
  });

  describe('finManyPostsCount without filter', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.findManyPostsCount(testEmptyPostFilterCriterias)).toStrictEqual(testPostCount);
      expect(postServiceMock.findManyPostsCount).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('finManyPostsCount with post find criterias for title', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.findManyPostsCount(testWithTitleFindPostCriterias)).toStrictEqual(testPostCount);
      expect(postServiceMock.findManyPostsCount).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('finManyPostsCount with filter find criterias for title', () => {
    it('should return testServicePostCount"', async () => {
      expect(await postController.findManyPostsCount(testWithTitleFilterFindCriterias)).toStrictEqual(testPostCount);
      expect(postServiceMock.findManyPostsCount).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
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
