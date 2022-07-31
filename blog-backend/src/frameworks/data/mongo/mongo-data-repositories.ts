import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IDataRepositories, IGenericDataRepository } from '../../../core/repositories';
import { MongoGenericDataRepository } from './mongo-generic-data-repository';
import { User, UserDocument } from './model/user.model';
import { Post, PostDocument } from './model/post.model';
import { Category, CategoryDocument } from './model/category.model';
@Injectable()
export class MongoDataRepositories extends IDataRepositories {
  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<UserDocument>,
    @InjectModel(Post.name)
    private readonly PostRepository: Model<PostDocument>,
    @InjectModel(Category.name)
    private readonly CategoryRepository: Model<CategoryDocument>,
  ) { 
    super();
    this.users = new MongoGenericDataRepository<User>(this.UserRepository);
    this.posts = new MongoGenericDataRepository<Post>(this.PostRepository, ['user', 'category']);
    this.categories = new MongoGenericDataRepository<Category>(this.CategoryRepository);
  }
}
