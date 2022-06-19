import { Post, User } from '../entities';
import { IGenericDataRepository } from './generic-data-repository.interface';

export abstract class IDataRepositories {
  users: IGenericDataRepository<User>;
  posts: IGenericDataRepository<Post>;
}
