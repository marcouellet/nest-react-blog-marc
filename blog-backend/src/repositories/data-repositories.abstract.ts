import { Category, Post, User } from '@Shared/entities';

import { IGenericDataRepository } from './generic-data-repository.interface';

export abstract class IDataRepositories {
  categories: IGenericDataRepository<Category>;
  posts: IGenericDataRepository<Post>;
  users: IGenericDataRepository<User>;
}
