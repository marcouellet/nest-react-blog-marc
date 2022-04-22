import { Post, Author } from '../entities';
import { IGenericDataServicesRepository } from './generic-data-services-repository.abstract';

export abstract class IDataServicesRepositories {
  authors: IGenericDataServicesRepository<Author>;
  posts: IGenericDataServicesRepository<Post>;
}
