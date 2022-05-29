import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataRepositories, IGenericDataRepository } from '../../../../src/core';
import { GenericDataRepository } from './generic-data-repository';
import { User, UserDocument } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post, PostDocument } from '../../../../src/frameworks/data/mongo/model/post.model';

@Injectable()
export class DataRepositoryFactory extends IDataRepositories {

  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    private readonly UserRepository: Model<UserDocument>,
    private readonly PostRepository: Model<PostDocument>,
  ) {
       super();
       this.users = new GenericDataRepository<User>(this.UserRepository);
       this.posts = new GenericDataRepository<Post>(this.PostRepository, ['user']);
    }
}
