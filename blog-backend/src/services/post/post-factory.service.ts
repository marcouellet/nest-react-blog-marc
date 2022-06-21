import { Injectable } from '@nestjs/common';
import { Post, Category } from '../../core/entities';
import { PostDto, IUpdatePostCriterias, UpdatePostDto } from '../../core/dtos';
import { IDataRepositories } from '../../core/repositories';
import { UserFactoryService } from '../user/user-factory.service';
import { CategoryFactoryService } from '../category/category-factory.service';

@Injectable()
export class PostFactoryService {

  constructor(
    private readonly dataServicesRepositories: IDataRepositories,
    private readonly userFactoryService: UserFactoryService,
    private readonly categoryFactoryService: CategoryFactoryService) {}

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
    postDto.user = this.userFactoryService.removeRestrictedProperties(this.userFactoryService.createUserDto(newPost.user));
    postDto.category = this.categoryFactoryService.createCategoryDto(newPost.category);
    postDto.publishDate = newPost.publishDate;

    return postDto;
  }

  // Make sure only desired criterias are selected from the incomming object
  createUpdatePostCriterias(updatePostDto: UpdatePostDto): IUpdatePostCriterias {
    const populate = {populate: { path: 'user' }};
    const {title, description, body} = updatePostDto;
    const category = this.categoryFactoryService.createCategory(updatePostDto.category);
    return {category, title, description, body, populate} as IUpdatePostCriterias;
  }
}
