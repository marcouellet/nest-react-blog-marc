import { Category } from '../../src/core/entities';
import { CategoryFindCriterias } from '../../src/core/find-criterias/category.find-criterias';
import { testCategory, testCategoryCount } from '../data/category.data';

const CategoryRepositoryMock = {
    provide: Category.name,
    useValue: {
        convertToGenericEntity: jest.fn().mockImplementation((obj) => obj),
        convertFromGenericEntity: jest.fn().mockImplementation((obj) => obj),
        getAll: jest.fn().mockImplementation(() => Promise.resolve([testCategory])),
        get: jest.fn().mockImplementation((id: string) => Promise.resolve(testCategory)),
        findOne: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve(testCategory)),
        findMany: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve([testCategory])),
        findManyCount: jest.fn().mockImplementation((criterias: CategoryFindCriterias) => Promise.resolve(testCategoryCount)),
        create: jest.fn().mockImplementation((category: Category) => Promise.resolve(testCategory)),
        update: jest.fn().mockImplementation((id: string, update: {}, populate?: string) => Promise.resolve(testCategory)),
        delete: jest.fn().mockImplementation((id: string, populate?: string) => Promise.resolve(testCategory)),
    },
};

export default CategoryRepositoryMock;
