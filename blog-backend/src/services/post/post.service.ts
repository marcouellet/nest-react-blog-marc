import { Injectable } from '@nestjs/common';
import { Post } from '../../core/entities';
import { IDataServicesRepositories } from '../../core/abstracts';
import { CreatePostDto, UpdatePostDto } from '../../core/dtos';
import { PostFactoryService } from './post-factory.service';

@Injectable()
export class PostService {

  constructor(
    private dataRepositories: IDataServicesRepositories,
    private postFactoryService: PostFactoryService,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.dataRepositories.posts.getAll();
  }

  getPostById(id: any): Promise<Post> {
    return this.dataRepositories.posts.get(id);
  }

  createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postFactoryService.createNewPost(createPostDto);
    return this.dataRepositories.posts.create(post);
  }

  updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = this.postFactoryService.updatePost(updatePostDto);
    return this.dataRepositories.posts.update(postId, post);
  }

  deletePost(id: any )  : Promise<Post>
  {
    return this.dataRepositories.posts.delete(id);
  }
}
