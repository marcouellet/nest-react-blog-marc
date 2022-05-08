import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { PostDto } from '../../core/dtos';
import { UserFactoryService } from '../user/user-factory.service';

@Injectable()
export class PostFactoryService {

  constructor(private userFactoryService: UserFactoryService) {}

  createPost(postDto:PostDto): Post {
    const post = new Post();
    post.title = postDto.title;
    post.description = postDto.description;
    post.body = postDto.body;
    post.user = this.userFactoryService.createUser(postDto.user);
    post.publishDate = postDto.publishDate;

    return post;
  }

  updatePost(postDto: PostDto): Post {
    const post = new Post();
    post.title = postDto.title;
    post.description = postDto.description;
    post.body = postDto.body;
    post.user = this.userFactoryService.createUser(postDto.user);
    post.publishDate = postDto.publishDate;

    return post;
  }

  createPostDto(post: Post): PostDto {
    const postDto = new PostDto();
    postDto.id = post.id;
    postDto.title = post.title;
    postDto.description = post.description;
    postDto.body = post.body;
    postDto.user = this.userFactoryService.createUserDto(post.user);
    postDto.publishDate = post.publishDate;

    return postDto;
  }
}
