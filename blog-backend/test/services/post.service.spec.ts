import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../src/services/post/post.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataServiceRepositories } from '../../src/services/data.service.repositories';
import { DataModuleStub } from '../stubs/data.module.stub';
import { Post } from '../../src/core/entities/post.entity';
import { IGenericDataRepository } from '../../src/core/repositories/generic-data-repository.abstract';
import { testPostId, testServicePostDto, testPostCount, testUserPostsCount, testCreatePostDto, 
          testUpdatePostDto, testFindPostCriterias } from '../data/post.data';
import { ConfigModule } from '../../src/modules/config.module';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('PostService', () => {
  let postService: PostService;
  let dataServiceRepositories: DataServiceRepositories;
  let postRepositoryMock: IGenericDataRepository<Post>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [PostService, PostFactoryService, UserFactoryService, DataServiceRepositories],
    }).compile();

    postService = module.get<PostService>(PostService);
    dataServiceRepositories = module.get<DataServiceRepositories>(DataServiceRepositories);
    const repositories: any = dataServiceRepositories.repositories();
    postRepositoryMock = repositories.PostRepository; // PostRepository dymamically added by jest
  });

  it('postService should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('dataServiceRepositories should be defined', () => {
    expect(dataServiceRepositories).toBeDefined();
  });

  it('postRepositoryMock should be defined', () => {
    expect(postRepositoryMock).toBeDefined();
  });

  describe('getAllPosts', () => {
    it('should return an array of one post', async () => {
      expect(await postService.getAllPosts()).toEqual([testServicePostDto]);
      expect(postRepositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return a post', async () => {
      expect(await postService.getPostById(testPostId)).toEqual(testServicePostDto);
      expect(postRepositoryMock.get).toHaveBeenCalledWith(testPostId);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1', async () => {
      expect(await postService.getNumberOfPostsForUser(testPostId)).toEqual(testUserPostsCount);
      expect(postRepositoryMock.findManyCountForSubDocumentId).toHaveBeenCalledWith('user', testPostId);
    });
  });

  describe('findManyCount', () => {
    it('should return testServicePostCount', async () => {
      expect(await postService.findManyPostsCount(testFindPostCriterias)).toEqual(testPostCount);
      expect(postRepositoryMock.findManyCount).toHaveBeenCalledWith(testFindPostCriterias);
    });
  });

  describe('findPost', () => {
    it('should return a post', async () => {
      expect(await postService.findPost(testFindPostCriterias)).toEqual(testServicePostDto);
      expect(postRepositoryMock.findOne).toHaveBeenCalledWith(testFindPostCriterias);
    });
  });

  describe('findManyPosts', () => {
    it('should return an array of one post', async () => {
      expect(await postService.findManyPosts(testFindPostCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findMany).toHaveBeenCalledWith(testFindPostCriterias);
    });
  });

  describe('findManPostsCount', () => {
    it('should return testPostCount', async () => {
      expect(await postService.findManyPostsCount(testFindPostCriterias)).toEqual(testPostCount);
      expect(postRepositoryMock.findManyCount).toHaveBeenCalledWith(testFindPostCriterias);
    });
  });

  describe('createPost', () => {
    it('should return a post', async () => {
      expect(await postService.createPost(testCreatePostDto)).toEqual(testServicePostDto);
      expect(postRepositoryMock.create).toHaveBeenCalled();
    });
  });

  describe('updatePost', () => {
    it('should return a post', async () => {
      expect(await postService.updatePost(testPostId, testUpdatePostDto)).toEqual(testServicePostDto);
      expect(postRepositoryMock.get).toHaveBeenCalledWith(testPostId); // check if post exist
      expect(postRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should return a post', async () => {
      expect(await postService.deletePost(testPostId)).toEqual(testServicePostDto);
      expect(postRepositoryMock.get).toHaveBeenCalledWith(testPostId); // check if post exist
      expect(postRepositoryMock.delete).toHaveBeenCalledWith(testPostId, 'user');
    });
  });
});
