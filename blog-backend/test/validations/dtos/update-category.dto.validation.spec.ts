import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';

import { minimumCategoryTitleLength, minimumCategoryDescriptionLength } from 'shared/entities/category.entity';
import { buildUpdateCategoryDto  } from 'shared/builders/category.dtos.builders';
import { testCreateCategoryDto } from '../../data/category.data';

describe('UpdateCategoryDto Validation', () => {

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      }).compile();
  });

  it('should complain for title length too short', async () => {
      const categoryDto = buildUpdateCategoryDto(testCreateCategoryDto);
      categoryDto.title = '_'.repeat(minimumCategoryTitleLength ? minimumCategoryTitleLength - 1 : 0);
      const errors = await validate(categoryDto, { skipMissingProperties: true });
      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error.property === 'title');
  });

  it('should complain for description length too short', async () => {
    const categoryDto = buildUpdateCategoryDto(testCreateCategoryDto);
    categoryDto.description = '_'.repeat(minimumCategoryDescriptionLength ? minimumCategoryDescriptionLength - 1 : 0);
    const errors = await validate(categoryDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'description');
  });
});
