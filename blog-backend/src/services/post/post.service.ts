import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { PostDto } from '../../core/dtos';
import { PostFactoryService } from './post-factory.service';
@Injectable()
export class PostService {

  constructor(
    private dataServicesRepositories: IDataServicesRepositories,
    private postFactoryService: PostFactoryService,
  ) {}

  createPostDto(post: Post): PostDto {
    return this.postFactoryService.createPostDto(this.dataServicesRepositories.posts.convertToGenericId(post));
  }

  getAllPosts(): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.getAll()
    .then(posts => posts.map(post => this.createPostDto(post)));
  }

  getPostById(id: any): Promise<PostDto> {
    return this.dataServicesRepositories.posts.get(id)
    .then(post =>this.createPostDto(post));
  }

  findPost(criterias: any): Promise<PostDto> {
    return this.dataServicesRepositories.posts.findOne(criterias)
      .then(post => this.createPostDto(post));
  }

  findManyPosts(criterias: any): Promise<PostDto[]> {
    return this.dataServicesRepositories.posts.findMany(criterias)
      .then(posts => posts.map(post => this.createPostDto(post)));
  }

  createPost(postDto: PostDto): Promise<PostDto> {
    const post = this.postFactoryService.createPost(postDto);
    return this.dataServicesRepositories.posts.create(post)
      .then(post => this.createPostDto(post));
  }

  updatePost(postDto: PostDto): Promise<PostDto> {
    const post = this.postFactoryService.updatePost(postDto);
    return this.dataServicesRepositories.posts.update(post.id, post)
      .then(post => this.createPostDto(post));
  }

  deletePost(id: any )  : Promise<Post>
  {
    return this.dataServicesRepositories.posts.delete(id);
  }
}
