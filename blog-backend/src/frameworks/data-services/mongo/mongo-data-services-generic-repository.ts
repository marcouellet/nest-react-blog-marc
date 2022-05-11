import { Model } from 'mongoose';
import { IGenericDataServicesRepository } from '../../../core';

export class MongoGenericDataServicesRepository<T> implements IGenericDataServicesRepository<T> {
  private repository: Model<T>;
  private populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this.repository = repository;
    this.populateOnFind = populateOnFind;
  }

  convertToGenericEntity(obj: any): T {
    const newObj = obj;
    newObj.id = obj._id.toString();
    delete newObj._id;
    return newObj;
  }

  convertFromGenericEntity(obj: any): T {
    const newObj = obj;
    obj._id = obj.id;
    delete newObj.id;
    return newObj;
  }

  async getAll(): Promise<T[]> {
    return this.repository.find().populate(this.populateOnFind).exec() as Promise<T[]>;
  }

  async get(id: string): Promise<T> {
    return this.repository.findById(id).populate(this.populateOnFind).exec() as Promise<T>;
  }

  async findOne(criterias: {}): Promise<T> {
    return this.repository.findOne(criterias).populate(this.populateOnFind).exec() as Promise<T>;
  }

  async findMany(criterias: {}): Promise<T[]> {
    return this.repository.find(criterias).populate(this.populateOnFind).exec() as Promise<T[]>;
  }

  async create(item: T): Promise<T> {
    return this.repository.create(item) as Promise<T>;
  }

  async update(id: string, update: {}, populate?: string) {
    let populateCriterias: any = null;
    if (populate) {
      populateCriterias = {populate: { path: populate }};
    }
    return this.repository.findByIdAndUpdate(id, update, populateCriterias).exec();
  }

  async delete(id: string, populate?: string): Promise<T> {
    let populateCriterias: any = null;
    if (populate) {
      populateCriterias = {populate: { path: populate }};
    }
    return await this.repository.findByIdAndDelete(id, populateCriterias).exec();
  }
}
