import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { PostDto, UpdatePostCriterias, UpdatePostDto } from '../../core/dtos';
import { IDataServicesRepositories } from '../../core/abstracts';
import { UserFactoryService } from '../user/user-factory.service';

@Injectable()
export class PostFactoryService {

  constructor(
    private readonly dataServicesRepositories: IDataServicesRepositories,
    private readonly userFactoryService: UserFactoryService) {}

  createPost(postDto: PostDto): Post {
    const post = new Post();
    post.id = postDto.id;
    post.title = postDto.title;
    post.description = postDto.description;
    post.body = postDto.body;
    post.user = this.userFactoryService.createUser(postDto.user);
    post.publishDate = new Date();

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

  // Make sure only desired criterias are selected from the incomming object
  createUpdatePostCriterias(updatePostDto: UpdatePostDto): UpdatePostCriterias {
    const populate = {populate: { path: 'user' }};
    const {title, description, body} = updatePostDto;
    return {title, description, body, populate} as UpdatePostCriterias;
  }
}
