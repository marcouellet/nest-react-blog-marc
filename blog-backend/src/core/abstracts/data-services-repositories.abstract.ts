import { Post, Author } from '../entities';
import { IGenericDataServicesRepository } from './generic-data-services-repository.abstract';

export abstract class IDataServicesRepositories {
  abstract authors: IGenericDataServicesRepository<Author>;
  abstract posts: IGenericDataServicesRepository<Post>;
}
