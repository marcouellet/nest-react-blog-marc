import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, Post, User } from 'shared/entities';
import { IDataRepositories, IGenericDataRepository } from 'repositories';
import { MongoGenericDataRepository } from './mongo-generic-data-repository';

@Injectable()
export class MongoDataRepositories extends IDataRepositories {
  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<User>,
    @InjectModel(Post.name)
    private readonly PostRepository: Model<Post>,
    @InjectModel(Category.name)
    private readonly CategoryRepository: Model<Category>,
  ) {
    super();
    this.users = new MongoGenericDataRepository<User>(this.UserRepository);
    this.posts = new MongoGenericDataRepository<Post>(this.PostRepository, ['user', 'category']);
    this.categories = new MongoGenericDataRepository<Category>(this.CategoryRepository);
  }
}
