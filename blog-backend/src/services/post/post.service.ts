import { Injectable, NotFoundException } from '@nestjs/common';

import { IDataRepositories } from '../../core/repositories';
import { Post } from '../../core/entities';
import { PostDto, UpdatePostDto } from '../../core/dtos';
import { FilterFindCriterias } from '../../core/find-criterias/filter.find-criterias';
import { PostFindCriterias } from '../../core/find-criterias/post.find-criterias';
import { PostFactoryService } from './post-factory.service';
@Injectable()
export class PostService {

  constructor(
      private readonly dataServicesRepositories: IDataRepositories,
      private readonly postFactoryService: PostFactoryService,
    ) {}

  private processPost(post: Post): PostDto {
    if (post) {
      return this.postFactoryService.createPostDto(post);
    } else {
      throw new NotFoundException('Post not found');
    }
  }

  async getAllPosts(): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.getAll()
      .then(posts => posts.map(post => this.processPost(post)));
  }

  async getNumberOfPostsForUser(userId: string): Promise<number> {
    return  this.dataServicesRepositories.posts.findManyCountForSubDocument('user', userId, {});
  }

  async getNumberOfPostsForCategory(categoryId: string): Promise<number> {
    return  this.dataServicesRepositories.posts.findManyCountForSubDocument('category', categoryId, {});
  }

  async getPost(id: string): Promise<PostDto> {
    return this.dataServicesRepositories.posts.get(id)
      .then(post => this.processPost(post));
  }

  async findPost(criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto> {
    return this.dataServicesRepositories.posts.findOne(criterias)
      .then(post => this.processPost(post));
  }

  async findManyPosts(criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findMany(criterias)
      .then(posts => posts.map(post => this.processPost(post)));
  }

  async findManyPostsForUser(userId: string, criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findManyForSubDocument('user', userId, criterias)
      .then(posts => posts.map(post => this.processPost(post)));
  }

  async findManyPostsForCategory(categoryId: string, criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findManyForSubDocument('category', categoryId, criterias)
      .then(posts => posts.map(post => this.processPost(post)));
  }

  async findManyPostsWithoutCategory(criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findManyForSubDocument('category', undefined, criterias)
      .then(posts => posts.map(post => this.processPost(post)));
  }

  async findManyPostsCount(criterias: PostFindCriterias | FilterFindCriterias): Promise<number> {
    return this.dataServicesRepositories.posts.findManyCount(criterias);
  }

  async createPost(postDto: PostDto): Promise<PostDto> {
    const newPost = this.postFactoryService.createPost(postDto);
    return this.dataServicesRepositories.posts.create(newPost)
      .then(post => this.processPost(post));
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<PostDto> {
    const updatedPostCriterias = this.postFactoryService.createUpdatePostCriterias(updatePostDto);
    return this.getPost(id)
      .then(async () => {   
        if (!updatePostDto.category) {
          await this.dataServicesRepositories.posts.unset(id, {category: ""});
        }
        if (!updatePostDto.image) {
          await this.dataServicesRepositories.posts.unset(id, {image: ""});
        }

        return this.dataServicesRepositories.posts.update(id, updatedPostCriterias, ['user', 'category'])  
        .then(post => this.processPost(post));
      });
  }

  async deletePost(id: string): Promise<PostDto> {
    return this.getPost(id)
      .then(_ =>  this.dataServicesRepositories.posts.delete(id, ['user', 'category']))
      .then(post => this.processPost(post))
      .catch(error => { 
        throw error;
      });
  }
}
