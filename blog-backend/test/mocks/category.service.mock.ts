import { CategoryService } from 'services/category/category.service';
import { CategoryDto, UpdateCategoryDto } from 'shared/dtos';
import { CategoryFindCriterias } from 'shared/find-criterias';
import { testCategory, testCategoryCount } from '../data/category.data';

const CategoryServiceMock = {
    provide: CategoryService,
    useValue: {
      getAllCategories: jest.fn().mockImplementation(() => Promise.resolve([testCategory])),
      getCategoryById: jest.fn().mockImplementation((id: string) => Promise.resolve(testCategory)),
      findCategory: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve(testCategory)),
      findManyCategories: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve([testCategory])),
      findManyCategoriesCount: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve(testCategoryCount)),
      createCategory: jest.fn().mockImplementation((postDto: CategoryDto) => Promise.resolve(testCategory)),
      updateCategory: jest.fn().mockImplementation((id: string, updateCategoryDto: UpdateCategoryDto) => Promise.resolve(testCategory)),
      deleteCategory: jest.fn().mockImplementation((id: string) => Promise.resolve(testCategory)),
    },
};

export default CategoryServiceMock;
