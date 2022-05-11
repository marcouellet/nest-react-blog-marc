import { Injectable } from '@nestjs/common';
import { IDataServicesRepositories } from '../../core/abstracts';
import { PostDto, UpdatePostDto } from '../../core/dtos';
import { PostFactoryService } from './post-factory.service';
@Injectable()
export class PostService {

  constructor(
    private readonly dataServicesRepositories: IDataServicesRepositories,
    private readonly postFactoryService: PostFactoryService,
  ) {}

  async getAllPosts(): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.getAll()
      .then(posts => posts.map(post => this.postFactoryService.createPostDto(post)));
  }

  async getPostById(id: string): Promise<PostDto> {
    return this.dataServicesRepositories.posts.get(id)
      .then(post => this.postFactoryService.createPostDto(post));
  }

  async findPost(criterias: {}): Promise<PostDto> {
    return this.dataServicesRepositories.posts.findOne(criterias)
      .then(post => this.postFactoryService.createPostDto(post));
  }

  async findManyPosts(criterias: {}): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findMany(criterias)
      .then(posts => posts.map(post => this.postFactoryService.createPostDto(post)));   
  }

  async createPost(postDto: PostDto): Promise<PostDto> {
    const newPost = this.postFactoryService.createPost(postDto);
    return this.dataServicesRepositories.posts.create(newPost)
      .then(post => this.postFactoryService.createPostDto(post));
  }

  async updatePost(id:string, updatePostDto: UpdatePostDto): Promise<PostDto> {
    const updatedPostCriterias = this.postFactoryService.createUpdatePostCriterias(updatePostDto);
    return this.dataServicesRepositories.posts.update(id, updatedPostCriterias, 'user')
      .then(post => this.postFactoryService.createPostDto(post));
  }

  async deletePost(id: string): Promise<PostDto> {
    return this.dataServicesRepositories.posts.delete(id, 'user')
      .then(post => this.postFactoryService.createPostDto(post));
  }
}
