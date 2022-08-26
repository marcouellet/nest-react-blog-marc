import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

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
