import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServicesRepositories, IGenericDataServicesRepository } from '../../../core';
import { MongoGenericDataServicesRepository } from './mongo-data-services-generic-repository';
import {  User, UserDocument } from './model/user.model';
import {  Post, PostDocument } from './model/post.model';
@Injectable()
export class MongoDataServicesRepositories extends IDataServicesRepositories implements OnApplicationBootstrap
{
  override users: IGenericDataServicesRepository<User>;
  override posts: IGenericDataServicesRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly PostRepository: Model<PostDocument>,
  ) { super(); }

  onApplicationBootstrap() {
    this.users = new MongoGenericDataServicesRepository<User>(this.UserRepository);
    this.posts = new MongoGenericDataServicesRepository<Post>(this.PostRepository, ['user']);
  }
}
