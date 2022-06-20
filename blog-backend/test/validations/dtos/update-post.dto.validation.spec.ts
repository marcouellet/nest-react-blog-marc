import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';
import { testCreatePostDto } from '../../data/post.data';
import { buildUpdatePostDto  } from '../../builders/post.dtos.builders';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '../../../src/core/entities/post.entity';

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

  it('should complain for body length too short', async () => {
    const postDto = buildUpdatePostDto(testCreatePostDto);
    postDto.body = '_'.repeat(minimumPostBodyLength ? minimumPostBodyLength - 1 : 0);
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'body');
  });
});
