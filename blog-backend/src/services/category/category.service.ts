import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@Shared/entities';
import { CategoryDto, UpdateCategoryDto } from '@Shared/dtos';
import { CategoryFindCriterias } from '@Shared/find-criterias/category.find-criterias';

import { IDataRepositories } from '../../repositories';
import { CategoryFactoryService } from './category-factory.service';
@Injectable()
export class CategoryService {

  constructor(
      private readonly dataServicesRepositories: IDataRepositories,
      private readonly categoryFactoryService: CategoryFactoryService,
    ) {}

  private processCategory(category: Category): CategoryDto {
    if (category) {
      return this.categoryFactoryService.createCategoryDto(category);
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  async getAllCategories(): Promise<CategoryDto[]> {
    return this.dataServicesRepositories.categories.getAll()
      .then(categorys => categorys.map(category => this.processCategory(category)));
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    return this.dataServicesRepositories.categories.get(id)
      .then(category => this.processCategory(category));
  }

  async findCategory(criterias: CategoryFindCriterias): Promise<CategoryDto> {
    return this.dataServicesRepositories.categories.findOne(criterias)
      .then(category => this.processCategory(category))
      .catch(error => { throw error; } );
  }

  async findManyCategories(criterias: CategoryFindCriterias): Promise<CategoryDto[]> {
    return this.dataServicesRepositories.categories.findMany(criterias)
      .then(categorys => categorys.map(category => this.processCategory(category)));
  }

  async findManyCategoriesCount(criterias: CategoryFindCriterias): Promise<number> {
    return this.dataServicesRepositories.categories.findManyCount(criterias);
  }

  async createCategory(categoryDto: CategoryDto): Promise<CategoryDto> {
    const newCategory = this.categoryFactoryService.createCategory(categoryDto);
    return this.dataServicesRepositories.categories.create(newCategory)
      .then(category => this.processCategory(category));
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const updatedCategoryCriterias = this.categoryFactoryService.createUpdateCategoryCriterias(updateCategoryDto);
    return this.getCategoryById(id)
      .then(_ => this.dataServicesRepositories.categories.update(id, updatedCategoryCriterias))
      .then(category => this.processCategory(category));
  }

  async deleteCategory(id: string): Promise<CategoryDto> {
    return this.getCategoryById(id)
      .then(_ =>  this.dataServicesRepositories.categories.delete(id))
      .then(category => this.processCategory(category));
  }
}
