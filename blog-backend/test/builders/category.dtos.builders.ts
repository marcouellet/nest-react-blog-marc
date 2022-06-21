import { CreateCategoryDto } from '../../src/core/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../src/core/dtos/update-category.dto';

export function buildCreateCategoryDto(fields: any ): CreateCategoryDto {
    const createCategoryDto = new CreateCategoryDto();
    createCategoryDto.title = fields.title;
    createCategoryDto.description = fields.description;

    return createCategoryDto;
}

export function buildUpdateCategoryDto(fields: any ): UpdateCategoryDto {
  const updateCategoryDto = new UpdateCategoryDto();
  updateCategoryDto.title = fields.title;
  updateCategoryDto.description = fields.description;

  return updateCategoryDto;
}
