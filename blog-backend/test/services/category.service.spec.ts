import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '@Services/category/category.service';
import { CategoryFactoryService } from '@Services/category/category-factory.service';
import { DataServiceRepositories } from '@Services/data.service.repositories';
import { Category } from '@blog-common/entities/category.entity';
import { ConfigModule } from '@Modules/config.module';
import { IGenericDataRepository } from 'src/repositories/generic-data-repository.interface';

import { DataModuleStub } from '../stubs/data.module.stub';
import { testCategoryId, testServiceCategoryDto, testCategoryCount, testCreateCategoryDto,
          testUpdateCategoryDto, testFindCategoryCriterias } from '../data/category.data';

import { GLOBAL_TEST_CONFIG_SERVICE } from '../config/config.global';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let dataServiceRepositories: DataServiceRepositories;
  let categoryRepositoryMock: IGenericDataRepository<Category>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
        DataModuleStub.register(GLOBAL_TEST_CONFIG_SERVICE),
      ],
      providers: [CategoryService, CategoryFactoryService, DataServiceRepositories],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    dataServiceRepositories = module.get<DataServiceRepositories>(DataServiceRepositories);
    const repositories: any = dataServiceRepositories.repositories();
    categoryRepositoryMock = repositories.CategoryRepository; // CategoryRepository dymamically added by jest
  });

  it('categoryService should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  it('dataServiceRepositories should be defined', () => {
    expect(dataServiceRepositories).toBeDefined();
  });

  it('categoryRepositoryMock should be defined', () => {
    expect(categoryRepositoryMock).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return an array of one post', async () => {
      expect(await categoryService.getAllCategories()).toEqual([testServiceCategoryDto]);
      expect(categoryRepositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a post', async () => {
      expect(await categoryService.getCategoryById(testCategoryId)).toEqual(testServiceCategoryDto);
      expect(categoryRepositoryMock.get).toHaveBeenCalledWith(testCategoryId);
    });
  });

  describe('findManyCount', () => {
    it('should return testServiceCategoryCount', async () => {
      expect(await categoryService.findManyCategoriesCount(testFindCategoryCriterias)).toEqual(testCategoryCount);
      expect(categoryRepositoryMock.findManyCount).toHaveBeenCalledWith(testFindCategoryCriterias);
    });
  });

  describe('findCategory', () => {
    it('should return a post', async () => {
      expect(await categoryService.findCategory(testFindCategoryCriterias)).toEqual(testServiceCategoryDto);
      expect(categoryRepositoryMock.findOne).toHaveBeenCalledWith(testFindCategoryCriterias);
    });
  });

  describe('findManyCategorys', () => {
    it('should return an array of one post', async () => {
      expect(await categoryService.findManyCategories(testFindCategoryCriterias)).toEqual([testServiceCategoryDto]);
      expect(categoryRepositoryMock.findMany).toHaveBeenCalledWith(testFindCategoryCriterias);
    });
  });

  describe('findManCategorysCount', () => {
    it('should return testCategoryCount', async () => {
      expect(await categoryService.findManyCategoriesCount(testFindCategoryCriterias)).toEqual(testCategoryCount);
      expect(categoryRepositoryMock.findManyCount).toHaveBeenCalledWith(testFindCategoryCriterias);
    });
  });

  describe('createCategory', () => {
    it('should return a post', async () => {
      expect(await categoryService.createCategory(testCreateCategoryDto)).toEqual(testServiceCategoryDto);
      expect(categoryRepositoryMock.create).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should return a post', async () => {
      expect(await categoryService.updateCategory(testCategoryId, testUpdateCategoryDto)).toEqual(testServiceCategoryDto);
      expect(categoryRepositoryMock.get).toHaveBeenCalledWith(testCategoryId); // check if post exist
      expect(categoryRepositoryMock.update).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should return a category', async () => {
      expect(await categoryService.deleteCategory(testCategoryId)).toEqual(testServiceCategoryDto);
      expect(categoryRepositoryMock.get).toHaveBeenCalledWith(testCategoryId); // check if category exist
      expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(testCategoryId, undefined);
    });
  });
});
