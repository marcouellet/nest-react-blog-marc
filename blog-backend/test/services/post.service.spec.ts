import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { PostService } from '../../src/services/post/post.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { testPostId, testServicePostDto, testCreatePostDto, testUpdatePostDto, testFindPostCriterias,
          testPostCount } from '../data/post.data';
import UserRepositoryProvider from '../providers/user.repository.provider';
import PostRepositoryProvider from '../providers/post.repository.provider';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [PostService, PostFactoryService, UserFactoryService,
                  UserRepositoryProvider, PostRepositoryProvider],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an array of one post', async () => {
      const result = await postService.getAllPosts();
      const dto = testServicePostDto;
      expect(await postService.getAllPosts()).toEqual([testServicePostDto]);
    });
  });

  describe('getPostById', () => {
    it('should return a post', async () => {
      expect(await postService.getPostById(testPostId)).toEqual(testServicePostDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1', async () => {
      expect(await postService.getNumberOfPostsForUser(testPostId)).toEqual(testPostCount);
    });
  });

  describe('findManyCount', () => {
    it('should return testPostCount', async () => {
      expect(await postService.findManyPostsCount(testFindPostCriterias)).toEqual(testPostCount);
    });
  });

  describe('findPost', () => {
    it('should return a post', async () => {
      expect(await postService.findPost(testFindPostCriterias)).toEqual(testServicePostDto);
    });
  });

  describe('findManyPosts', () => {
    it('should return an array of one post', async () => {
      expect(await postService.findManyPosts(testFindPostCriterias)).toEqual([testServicePostDto]);
    });
  });

  describe('findManPostsCount', () => {
    it('should return testPostCount', async () => {
      expect(await postService.findManyPostsCount(testFindPostCriterias)).toEqual(testPostCount);
    });
  });

  describe('createPost', () => {
    it('should return a post', async () => {
      expect(await postService.createPost(testCreatePostDto)).toEqual(testServicePostDto);
    });
  });

  describe('updatePost', () => {
    it('should return a post', async () => {
      expect(await postService.updatePost(testPostId, testUpdatePostDto)).toEqual(testServicePostDto);
    });
  });

  describe('deletePost', () => {
    it('should return a post', async () => {
      expect(await postService.deletePost(testPostId)).toEqual(testServicePostDto);
    });
  });
});
