import { Injectable } from '@nestjs/common';
import { Category } from '../../core/entities';
import { CategoryDto, IUpdateCategoryCriterias, UpdateCategoryDto } from '../../core/dtos';
import { IDataRepositories } from '../../core/repositories';

@Injectable()
export class CategoryFactoryService {

  constructor(private readonly dataServicesRepositories: IDataRepositories) {}

  createCategory(categorytDto: CategoryDto): Category {
    const category = new Category();
    category.id = categorytDto.id;
    category.title = categorytDto.title;
    category.description = categorytDto.description;

    return this.dataServicesRepositories.categories.convertFromGenericEntity(category);
  }

  createCategoryDto(category: Category): CategoryDto {
    const newCategory = this.dataServicesRepositories.categories.convertToGenericEntity(category);
    const categorytDto = new CategoryDto();
    categorytDto.id = newCategory.id;
    categorytDto.title = newCategory.title;
    categorytDto.description = newCategory.description;

    return categorytDto;
  }

  // Make sure only desired criterias are selected from the incomming object
  createUpdateCategoryCriterias(updateCategoryDto: UpdateCategoryDto): IUpdateCategoryCriterias {
    const {title, description } = updateCategoryDto;
    return {title, description} as IUpdateCategoryCriterias;
  }
}
