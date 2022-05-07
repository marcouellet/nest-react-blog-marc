import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { CreatePostDto, UpdatePostDto } from '../../core/dtos';
import { PostFactoryService } from './post-factory.service';
@Injectable()
export class PostService {

  constructor(
    private dataServicesRepositories: IDataServicesRepositories,
    private postFactoryService: PostFactoryService,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.dataServicesRepositories.posts.getAll()
    .then(posts => posts.map(post => this.dataServicesRepositories.posts.convertToGenericId(post)));
  }

  getPostById(id: any): Promise<Post> {
    return this.dataServicesRepositories.posts.get(id)
    .then(post => this.dataServicesRepositories.posts.convertToGenericId(post));
  }

  findPost(criterias: any): Promise<Post> {
    return this.dataServicesRepositories.posts.findOne(criterias)
      .then(post => this.dataServicesRepositories.posts.convertToGenericId(post));
  }

  findManyPosts(criterias: any): Promise<Post[]> {
    return this.dataServicesRepositories.posts.findMany(criterias)
      .then(posts => posts.map(post => this.dataServicesRepositories.posts.convertToGenericId(post)));
  }

  createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postFactoryService.createNewPost(createPostDto);
    return this.dataServicesRepositories.posts.create(post)
      .then(post => this.dataServicesRepositories.posts.convertToGenericId(post));
  }

  updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = this.postFactoryService.updatePost(updatePostDto);
    return this.dataServicesRepositories.posts.update(postId, post)
      .then(post => this.dataServicesRepositories.posts.convertToGenericId(post));
  }

  deletePost(id: any )  : Promise<Post>
  {
    return this.dataServicesRepositories.posts.delete(id);
  }
}
