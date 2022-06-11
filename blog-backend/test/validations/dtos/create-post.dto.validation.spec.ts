import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';
import { testCreatePostDto } from '../../data/post.data';
import { buildCreatePostDto  } from './builders/post.dtos.builders';
import { minimumTitleLength, minimumDescriptionLength, minimumBodyLength } from '../../../src/core/entities/post.entity';

describe('CreatePostDto Validation', () => {

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      }).compile();
  });

  it('should complain for title length too short', async () => {
      let postDto = buildCreatePostDto(testCreatePostDto);
      postDto.title = '_'.repeat(minimumTitleLength ? minimumTitleLength-1 : 0);
      const errors = await validate(postDto, { skipMissingProperties: true });
      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error.property === 'title');
  });

  it('should complain for description length too short', async () => {
    let postDto = buildCreatePostDto(testCreatePostDto);
    postDto.description = '_'.repeat(minimumDescriptionLength ? minimumDescriptionLength-1 : 0);
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'description');
  });

  it('should complain for body length too short', async () => {
    let postDto = buildCreatePostDto(testCreatePostDto);
    postDto.body = '_'.repeat(minimumBodyLength ? minimumBodyLength-1 : 0);
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'body');
  });
});

