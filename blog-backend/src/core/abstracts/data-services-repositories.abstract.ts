import { Post, User } from '../entities';
import { IGenericDataServicesRepository } from './generic-data-services-repository.abstract';

export abstract class IDataServicesRepositories {
  users: IGenericDataServicesRepository<User>;
  posts: IGenericDataServicesRepository<Post>;
}
