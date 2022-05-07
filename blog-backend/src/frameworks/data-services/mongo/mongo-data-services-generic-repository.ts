import { Model } from 'mongoose';
import { IGenericDataServicesRepository } from '../../../core';

export class MongoGenericDataServicesRepository<T> implements IGenericDataServicesRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  convertToGenericId(obj: any): T {
    let newObj = obj;
    obj.id = obj._id;
    delete newObj['_id'];
    return newObj;
  }

  async getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }

  async get(id: string): Promise<T> {
    return this._repository.findById(id).populate(this._populateOnFind).exec() as Promise<T>;
  }

  async findOne(criterias: {}): Promise<T> {
    return this._repository.findOne(criterias).populate(this._populateOnFind).exec() as Promise<T>;
  }

  async findMany(criterias: {}): Promise<T[]> {
    return this._repository.find(criterias).populate(this._populateOnFind).exec() as Promise<T[]>;
  }

  async create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  async update(id: string, item: T) {
    return this._repository.findByIdAndUpdate(id, item);
  }

  async delete(id: string) {
    return this._repository.findByIdAndDelete(id);
  }
}
