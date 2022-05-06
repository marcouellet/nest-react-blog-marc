import { Model } from 'mongoose';
import { IGenericDataServicesRepository } from '../../../core';

export class MongoGenericDataServicesRepository<T> implements IGenericDataServicesRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }

  get(id: string): Promise<T> {
    return this._repository.findById(id).populate(this._populateOnFind).exec() as Promise<T>;
  }

  findOne(criterias: {}): Promise<T> {
    return this._repository.findOne(criterias).populate(this._populateOnFind).exec() as Promise<T>;
  }

  findMany(criterias: {}): Promise<T[]> {
    return this._repository.find(criterias).populate(this._populateOnFind).exec() as Promise<T[]>;
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item);
  }

  delete(id: string) {
    return this._repository.findByIdAndDelete(id);
  }
}
