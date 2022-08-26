import { Injectable, Inject } from '@nestjs/common';
import { User, Post, Category } from '@blog-common/entities';

import { IDataRepositories, IGenericDataRepository, GenericDataRepository } from '.';

@Injectable()
export class DataRepositories extends IDataRepositories {

  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;
  override categories: IGenericDataRepository<Category>;

  constructor(
    @Inject(User.name)
    private readonly UserRepository: IGenericDataRepository<User>,
    @Inject(Post.name)
    private readonly PostRepository: IGenericDataRepository<Post>,
    @Inject(Category.name)
    private readonly CategoryRepository: IGenericDataRepository<Category>,
  ) {
    super();
    this.users = new GenericDataRepository<User>(this.UserRepository);
    this.posts = new GenericDataRepository<Post>(this.PostRepository, ['user']);
    this.categories = new GenericDataRepository<Category>(this.CategoryRepository);
  }
}
