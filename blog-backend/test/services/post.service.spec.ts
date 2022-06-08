import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../src/services/post/post.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataModuleStub } from '../stubs/data.module.stub';
import { testPostId, testServicePostDto, testPostCount, testCreatePostDto, 
          testUpdatePostDto, testFindPostCriterias } from '../data/post.data';
import UserRepositoryMock from '../mocks/user.repository.mock';
import PostRepositoryMock from '../mocks/post.repository.mock';
import { ConfigModule } from '../../src/modules/config.module';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [PostService, PostFactoryService, UserFactoryService,
                  UserRepositoryMock, PostRepositoryMock],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an array of one post', async () => {
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
    it('should return testServicePostCount', async () => {
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
