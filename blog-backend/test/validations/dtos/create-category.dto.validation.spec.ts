import 'reflect-metadata'; // to fix TypeError: Reflect.getMetadata is not a function
import { validate } from '@nestjs/class-validator';
import { minimumCategoryTitleLength, minimumCategoryDescriptionLength } from '@Shared/entities/category.entity';
import { buildCreateCategoryDto  } from '@Shared/builders/category.dtos.builders';

import { testCreateCategoryDto } from '../../data/category.data';

describe('CreateCategoryDto Validation', () => {

  it('should complain for title length too short', async () => {
      const categoryDto = buildCreateCategoryDto(testCreateCategoryDto);
      categoryDto.title = '_'.repeat(minimumCategoryTitleLength ? minimumCategoryTitleLength - 1 : 0);
      const errors = await validate(categoryDto, { skipMissingProperties: true });
      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error.property === 'title');
  });

  it('should complain for description length too short', async () => {
    const categoryDto = buildCreateCategoryDto(testCreateCategoryDto);
    categoryDto.description = '_'.repeat(minimumCategoryDescriptionLength ? minimumCategoryDescriptionLength - 1 : 0);
    const errors = await validate(categoryDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'description');
  });
});
