import { Test, TestingModule } from '@nestjs/testing';

import { PostService } from '../../src/services/post/post.service';
import { CategoryFactoryService } from '../../src/services/category/category-factory.service';
import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { DataServiceRepositories } from '../../src/services/data.service.repositories';
import { DataModuleStub } from '../stubs/data.module.stub';
import { Post } from '../../src/core/entities/post.entity';
import { IGenericDataRepository } from '../../src/core/repositories/generic-data-repository.interface';
import { testPostId, testServicePostDto, testPostCount, testUserPostsCount, testCreatePostDto, testCategoryId,
          testUpdatePostDto, testWithTitleFindPostCriterias, testCategoryPostsCount, testWithTitleFilterFindCriterias,
          testServicePostWithoutCategoryDto, testEmptyPostFilterCriterias } from '../data/post.data';
import { testUserId } from '../data/user.data';
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
      providers: [DataServiceRepositories, PostService, CategoryFactoryService, UserFactoryService, PostFactoryService],
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

  describe('getPost', () => {
    it('should return a post', async () => {
      expect(await postService.getPost(testPostId)).toEqual(testServicePostDto);
      expect(postRepositoryMock.get).toHaveBeenCalledWith(testPostId);
    });
  });

  describe('findManyPostsForUser', () => {
    it('should return 1', async () => {
      expect(await postService.findManyPostsForUser(testUserId, testEmptyPostFilterCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('user', testUserId, {});
    });
  });

  describe('findManyPostsForCategory without filter', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsForCategory(testCategoryId, testEmptyPostFilterCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', testCategoryId, testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsForCategory with post find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsForCategory(testCategoryId, testWithTitleFindPostCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', testCategoryId, testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPostsForCategory with filter find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsForCategory(testCategoryId, testWithTitleFilterFindCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', testCategoryId, testWithTitleFilterFindCriterias);
    });
  });

  describe('findManyPostsWithoutCategory without filter', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsWithoutCategory(testEmptyPostFilterCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', undefined, testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsWithoutCategory with post find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsWithoutCategory(testWithTitleFindPostCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', undefined, testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPostsWithoutCategory filter find criterias for title', () => {
    it('should return 1 post', async () => {
      expect(await postService.findManyPostsWithoutCategory(testWithTitleFilterFindCriterias)).toEqual([testServicePostWithoutCategoryDto]);
      expect(postRepositoryMock.findManyForSubDocument).toHaveBeenCalledWith('category', undefined, testWithTitleFilterFindCriterias);
    });
  });

  describe('getNumberOfPostsForUser', () => {
    it('should return 1 post', async () => {
      expect(await postService.getNumberOfPostsForUser(testUserId)).toEqual(testUserPostsCount);
      expect(postRepositoryMock.findManyCountForSubDocument).toHaveBeenCalledWith('user', testPostId, {});
    });
  });

  describe('getNumberOfPostsForCategory', () => {
    it('should return 1', async () => {
      expect(await postService.getNumberOfPostsForCategory(testCategoryId)).toEqual(testCategoryPostsCount);
      expect(postRepositoryMock.findManyCountForSubDocument).toHaveBeenCalledWith('category', testCategoryId, {});
    });
  });

  describe('findPost without filter', () => {
    it('should return a post', async () => {
      expect(await postService.findPost(testEmptyPostFilterCriterias)).toEqual(testServicePostDto);
      expect(postRepositoryMock.findOne).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('findPost with post find criterias for title', () => {
    it('should return a post', async () => {
      expect(await postService.findPost(testWithTitleFindPostCriterias)).toEqual(testServicePostDto);
      expect(postRepositoryMock.findOne).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('findPost with filter find criterias for title', () => {
    it('should return a post', async () => {
      expect(await postService.findPost(testWithTitleFilterFindCriterias)).toEqual(testServicePostDto);
      expect(postRepositoryMock.findOne).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
    });
  });

  describe('findManyPosts without filter', () => {
    it('should return an array of one post', async () => {
      expect(await postService.findManyPosts(testEmptyPostFilterCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findMany).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPosts with post find criterias for title', () => {
    it('should return an array of one post', async () => {
      expect(await postService.findManyPosts(testWithTitleFindPostCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findMany).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPosts with filter find criterias for title', () => {
    it('should return an array of one post', async () => {
      expect(await postService.findManyPosts(testWithTitleFilterFindCriterias)).toEqual([testServicePostDto]);
      expect(postRepositoryMock.findMany).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
    });
  });

  describe('findManyPostsCount without filter', () => {
    it('should return testServicePostCount', async () => {
      expect(await postService.findManyPostsCount(testEmptyPostFilterCriterias)).toEqual(testPostCount);
      expect(postRepositoryMock.findManyCount).toHaveBeenCalledWith(testEmptyPostFilterCriterias);
    });
  });

  describe('findManyPostsCount with post find criterias for title', () => {
    it('should return testServicePostCount', async () => {
      expect(await postService.findManyPostsCount(testWithTitleFindPostCriterias)).toEqual(testPostCount);
      expect(postRepositoryMock.findManyCount).toHaveBeenCalledWith(testWithTitleFindPostCriterias);
    });
  });

  describe('findManyPostsCount with filter find criterias for title', () => {
    it('should return testServicePostCount', async () => {
      expect(await postService.findManyPostsCount(testWithTitleFilterFindCriterias)).toEqual(testPostCount);
      expect(postRepositoryMock.findManyCount).toHaveBeenCalledWith(testWithTitleFilterFindCriterias);
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
      expect(postRepositoryMock.delete).toHaveBeenCalledWith(testPostId, ['user', 'category']);
    });
  });
});
