import { Test, TestingModule } from '@nestjs/testing';
import { GetConfigMock } from '../mock/config/config.mock';
import { PostService } from '../../src/services/post/post.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { testPostId, testPostDto, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../data/post.data';
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
    it('should return an array of one post', () => {
      expect(postService.getAllPosts()).toBe([testPostDto]);
    });
  });

  describe('getPostById', () => {
    it('should return a post', () => {
      expect(postService.getPostById(testPostId)).toBe(testPostDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1', () => {
      expect(postService.getNumberOfPostsForUser(testPostId)).toBe(1);
    });
  });

  describe('findPost', () => {
    it('should return a post', () => {
      expect(postService.findPost(testFindPostCriterias)).toBe(testPostDto);
    });
  });

  describe('findManyPosts', () => {
    it('should return an array of one post', () => {
      expect(postService.findManyPosts(testFindPostCriterias)).toBe([testPostDto]);
    });
  });

  describe('createPost', () => {
    it('should return a post', () => {
      expect(postService.createPost(testCreatePostDto)).toBe(testPostDto);
    });
  });

  describe('updatePost', () => {
    it('should return a post', () => {
      expect(postService.updatePost(testPostId, testUpdatePostDto)).toBe(testPostDto);
    });
  });

  describe('deletePost', () => {
    it('should return a post', () => {
      expect(postService.deletePost(testPostId)).toBe(testPostDto);
    });
  });

});
