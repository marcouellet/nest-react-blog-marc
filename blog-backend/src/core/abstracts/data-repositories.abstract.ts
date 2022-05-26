import { Post, User } from '../entities';
import { IGenericDataRepository } from './generic-data-repository.abstract';

export abstract class IDataRepositories {
  users: IGenericDataRepository<User>;
  posts: IGenericDataRepository<Post>;
}
