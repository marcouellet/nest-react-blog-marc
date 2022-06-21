import { Category, Post, User } from '../entities';
import { IGenericDataRepository } from './generic-data-repository.interface';

export abstract class IDataRepositories {
  categories: IGenericDataRepository<Category>;
  posts: IGenericDataRepository<Post>;
  users: IGenericDataRepository<User>;
}
