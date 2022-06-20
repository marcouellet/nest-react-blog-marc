import { CreatePostDto } from '../../src/core/dtos/create-post.dto';
import { UpdatePostDto } from '../../src/core/dtos/update-post.dto';

export function buildCreatePostDto(fields: any ): CreatePostDto {
    const createPostDto = new CreatePostDto();
    createPostDto.title = fields.title;
    createPostDto.description = fields.description;
    createPostDto.body = fields.body;
    createPostDto.user = fields.user;
  
    return createPostDto;
}

export function buildUpdatePostDto(fields: any ): UpdatePostDto {
  const updatePostDto = new UpdatePostDto();
  updatePostDto.title = fields.title;
  updatePostDto.description = fields.description;
  updatePostDto.body = fields.body;

  return updatePostDto;
}
