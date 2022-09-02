import { Category } from '@Shared/entities';
import { CategoryDto, UpdateCategoryDto } from '@Shared/dtos';

export const testCategoryId = 'mnopqrstuvwz';
export const testCategoryCount = 1;

export const testCategoryDto: CategoryDto = {
  id: testCategoryId,
  title: 'title',
  description: 'description',
};

export const testCreateCategoryDto: CategoryDto = {
  title: 'title',
  description: 'description',
};

export const testUpdateCategoryDto: UpdateCategoryDto = {
  title: 'title',
  description: 'description',
};

export const testCategory: Category = {
  id: testCategoryId,
  title: 'title',
  description: 'description',
};

export const testServiceCategoryDto: CategoryDto = {
  id: testCategoryId,
  title: 'title',
  description: 'description',
};

export const testFindCategoryCriterias = { title: 'title' };
