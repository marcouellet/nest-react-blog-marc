import { Test, TestingModule } from '@nestjs/testing';
import { DataModuleMock } from '../mock/modules/data.module.mock';
import { GetConfigMock } from '../mock/config/config.mock';
import { PostService } from '../../src/services/post/post.service';
import PostFactoryServiceProvider from '../providers/post.factory.service.provider';
import { testPostDto, testCreatePostDto, testUpdatePostDto, testFindPostCriterias } from '../data/post.data';


describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataModuleMock.register(GetConfigMock())],
      providers: [PostFactoryServiceProvider],
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
      expect(postService.getPostById('1')).toBe(testPostDto);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1', () => {
      expect(postService.getNumberOfPostsForUser('1')).toBe(1);
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
      expect(postService.updatePost('1', testUpdatePostDto)).toBe(testPostDto);
    });
  });

  describe('deletePost', () => {
    it('should return a post', () => {
      expect(postService.deletePost('1')).toBe(testPostDto);
    });
  });

});
