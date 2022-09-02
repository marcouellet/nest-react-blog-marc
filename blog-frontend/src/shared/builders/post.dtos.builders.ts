import { PostDto, CreatePostDto, UpdatePostDto } from '../dtos';

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

export function createPostForUpdate(post: PostDto): UpdatePostDto {
  const updatePost: UpdatePostDto = {category: post.category, title:post.title, description: post.description, body: post.body,
                                    image: post.image};
  return updatePost;
}

