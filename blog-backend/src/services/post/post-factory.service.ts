import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { CreatePostDto, UpdatePostDto } from '../../core/dtos';

@Injectable()
export class PostFactoryService {
  createNewPost(createPostDto: CreatePostDto) {
    const newPost = new Post();
    newPost.title = createPostDto.title;
    newPost.description = createPostDto.description;
    newPost.body = createPostDto.body;
    newPost.user = createPostDto.userId;
    newPost.publishDate = createPostDto.publishDate;

    return newPost;
  }

  updatePost(updatePostDto: UpdatePostDto) {
    const newPost = new Post();
    newPost.title = updatePostDto.title;
    newPost.description = updatePostDto.description;
    newPost.body = updatePostDto.body;
    newPost.user = updatePostDto.userId;
    newPost.publishDate = updatePostDto.publishDate;

    return newPost;
  }
}
