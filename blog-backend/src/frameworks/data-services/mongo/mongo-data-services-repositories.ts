import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServicesRepositories, IGenericDataServicesRepository } from '../../../core';
import { MongoGenericDataServicesRepository } from './mongo-data-services-generic-repository';
import {
  User,
  UserDocument,
  Post,
  PostDocument,
} from './model';

@Injectable()
export class MongoDataServicesRepositories extends IDataServicesRepositories implements OnApplicationBootstrap
{
  override users: IGenericDataServicesRepository<User>;
  override posts: IGenericDataServicesRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private UserRepository: Model<UserDocument>,
    @InjectModel(Post.name)
    private PostRepository: Model<PostDocument>,
  ) {super();}

  onApplicationBootstrap() {
    this.users = new MongoGenericDataServicesRepository<User>(this.UserRepository);
    this.posts = new MongoGenericDataServicesRepository<Post>(this.PostRepository, ['user']);
  }
}
