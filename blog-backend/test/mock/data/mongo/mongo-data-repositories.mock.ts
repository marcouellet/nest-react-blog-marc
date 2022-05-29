import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataRepositories, IGenericDataRepository } from '../../../../src/core';
import { GenericDataRepositoryMock } from './model/generic-data-repository.mock';
import { User, UserDocument } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post, PostDocument } from '../../../../src/frameworks/data/mongo/model/post.model';

@Injectable()
export class MongoDataRepositoriesMock extends IDataRepositories implements OnApplicationBootstrap {

  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly PostRepository: Model<PostDocument>,
  ) { super(); }

  onApplicationBootstrap() {
    this.users = new GenericDataRepositoryMock<User>(this.UserRepository);
    this.posts = new GenericDataRepositoryMock<Post>(this.PostRepository, ['user']);
  }
}
