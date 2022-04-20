// import { Injectable } from '@nestjs/common';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post } from '../../../frameworks/data-services/mongo/interfaces/post.interface';
// import { CreatePostDto } from '../../../core/dtos';

// @Injectable()
// export class PostServices {
//   constructor(@InjectModel('Post') private readonly postModel: Model<Post>) { }
//   async getPosts(): Promise<Post[]> {
//     const posts = await this.postModel.find().exec();
//     return posts;
//   }
//   async getPost(postID): Promise<Post> {
//     const post = await this.postModel
//       .findById(postID)
//       .exec();
//     return post;
//   }
//   async addPost(createPostDto: CreatePostDto): Promise<Post> {
//     const newPost = await this.postModel(createPostDto);
//     return newPost.save();
//   }
//   async editPost(postID, createPostDto: CreatePostDto): Promise<Post> {
//     const editedPost = await this.postModel
//       .findByIdAndUpdate(postID, createPostDto, { new: true });
//     return editedPost;
//   }
//   async deletePost(postID): Promise<any> {
//     const deletedPost = await this.postModel
//       .findByIdAndRemove(postID);
//     return deletedPost;
//   }
// } 

import { Injectable } from '@nestjs/common';
import { Post } from '../../../core/entities';
import { IDataServices } from '../../../core/abstracts';
import { CreatePostDto, UpdatePostDto } from '../../../core/dtos';
import { PostFactoryService } from './post-factory.service';

@Injectable()
export class PostServices {
  constructor(
    private dataServices: IDataServices,
    private postFactoryService: PostFactoryService,
  ) {}

  getAllPosts(): Promise<Post[]> {
    return this.dataServices.posts.getAll();
  }

  getPostById(id: any): Promise<Post> {
    return this.dataServices.posts.get(id);
  }

  createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postFactoryService.createNewPost(createPostDto);
    return this.dataServices.posts.create(post);
  }

  updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = this.postFactoryService.updatePost(updatePostDto);
    return this.dataServices.posts.update(postId, post);
  }

  deletePost(id: any )  : Promise<Post>
  {
    return this.dataServices.posts.delete(id);
  }
}
