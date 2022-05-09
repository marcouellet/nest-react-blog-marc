import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { PostDto } from '../../core/dtos';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserFactoryService } from '../user/user-factory.service';

@Injectable()
export class PostFactoryService {

  constructor(
    private dataServicesRepositories: IDataServicesRepositories,
    private userFactoryService: UserFactoryService) {}

  createPost(postDto: PostDto): Post {
    const post = new Post();
    post.id = postDto.id;
    post.title = postDto.title;
    post.description = postDto.description;
    post.body = postDto.body;
    post.user = this.userFactoryService.createUser(postDto.user);
    post.publishDate = postDto.publishDate;

    return this.dataServicesRepositories.posts.convertFromGenericEntity(post);
  }

  updatePost(postDto: PostDto): Post {
    const post = new Post();
    post.id = postDto.id;
    post.title = postDto.title;
    post.description = postDto.description;
    post.body = postDto.body;
    post.user = this.userFactoryService.createUser(postDto.user);
    post.publishDate = postDto.publishDate;

    return this.dataServicesRepositories.posts.convertFromGenericEntity(post);
  }

  createPostDto(post: Post): PostDto {
    const newPost = this.dataServicesRepositories.posts.convertToGenericEntity(post);
    const postDto = new PostDto();
    postDto.id = newPost.id;
    postDto.title = newPost.title;
    postDto.description = newPost.description;
    postDto.body = newPost.body;
    postDto.user = this.userFactoryService.createUserDto(newPost.user);
    postDto.publishDate = newPost.publishDate;

    return postDto;
  }
}
