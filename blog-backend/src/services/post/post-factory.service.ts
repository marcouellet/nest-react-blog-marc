import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { CreatePostDto, UpdatePostDto } from '../../core/dtos';

@Injectable()
export class PostFactoryService {
  createNewPost(createBookDto: CreatePostDto) {
    const newPost = new Post();
    newPost.title = createBookDto.title;
    newPost.description = createBookDto.description;
    newPost.body = createBookDto.body;
    newPost.author = createBookDto.authorId;
    newPost.publishDate = createBookDto.publishDate;

    return newPost;
  }

  updatePost(updatePostDto: UpdatePostDto) {
    const newPost = new Post();
    newPost.title = updatePostDto.title;
    newPost.description = updatePostDto.description;
    newPost.body = updatePostDto.body;
    newPost.author = updatePostDto.authorId;
    newPost.publishDate = updatePostDto.publishDate;

    return newPost;
  }
}
