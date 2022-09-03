import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';

import { minimumPostTitleLength, minimumPostDescriptionLength } from 'shared/entities/post.entity';
import { buildUpdatePostDto  } from 'shared/builders/post.dtos.builders';
import { testCreatePostDto } from '../../data/post.data';

describe('UpdatePostDto Validation', () => {

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      }).compile();
  });

  it('should complain for title length too short', async () => {
      const postDto = buildUpdatePostDto(testCreatePostDto);
      postDto.title = '_'.repeat(minimumPostTitleLength ? minimumPostTitleLength - 1 : 0);
      const errors = await validate(postDto, { skipMissingProperties: true });
      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error.property === 'title');
  });

  it('should complain for description length too short', async () => {
    const postDto = buildUpdatePostDto(testCreatePostDto);
    postDto.description = '_'.repeat(minimumPostDescriptionLength ? minimumPostDescriptionLength - 1 : 0);
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'description');
  });

  it('should complain for body empty', async () => {
    const postDto = buildUpdatePostDto(testCreatePostDto);
    postDto.body = '';
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'body');
  });
});
