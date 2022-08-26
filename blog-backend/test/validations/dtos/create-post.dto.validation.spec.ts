import 'reflect-metadata'; // to fix TypeError: Reflect.getMetadata is not a function
import { validate } from '@nestjs/class-validator';
import { minimumPostTitleLength, minimumPostDescriptionLength, minimumPostBodyLength } from '@blog-common/entities/post.entity';
import { buildCreatePostDto  } from '@blog-common/builders/post.dtos.builders';

import { testCreatePostDto } from '../../data/post.data';

describe('CreatePostDto Validation', () => {

  it('should complain for title length too short', async () => {
      const postDto = buildCreatePostDto(testCreatePostDto);
      postDto.title = '_'.repeat(minimumPostTitleLength ? minimumPostTitleLength - 1 : 0);
      const errors = await validate(postDto, { skipMissingProperties: true });
      expect(errors.length).toEqual(1);
      const error = errors[0];
      expect(error.property === 'title');
  });

  it('should complain for description length too short', async () => {
    const postDto = buildCreatePostDto(testCreatePostDto);
    postDto.description = '_'.repeat(minimumPostDescriptionLength ? minimumPostDescriptionLength - 1 : 0);
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'description');
  });

  it('should complain for body empty', async () => {
    const postDto = buildCreatePostDto(testCreatePostDto);
    postDto.body = '';
    const errors = await validate(postDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'body');
  });
});
