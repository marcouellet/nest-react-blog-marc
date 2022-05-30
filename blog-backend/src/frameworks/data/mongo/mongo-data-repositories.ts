import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataRepositories, IGenericDataRepository } from '../../../core';
import { MongoGenericDataRepository } from './mongo-generic-data-repository';
import { User, UserDocument } from './model/user.model';
import { Post, PostDocument } from './model/post.model';
@Injectable()
export class MongoDataRepositories extends IDataRepositories implements OnApplicationBootstrap {
  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly PostRepository: Model<PostDocument>,
  ) { super(); }

  onApplicationBootstrap() {
    this.users = new MongoGenericDataRepository<User>(this.UserRepository);
    this.posts = new MongoGenericDataRepository<Post>(this.PostRepository, ['user']);
  }
}
