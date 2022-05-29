import { Model, Types } from 'mongoose';
import { IGenericDataRepository } from '../../../../src/core/abstracts/generic-data-repository.abstract';

export class GenericDataRepository<T> implements IGenericDataRepository<T> {

  constructor(private readonly repository: Model<T>, private readonly populateOnFind: string[] = []) {}

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

  async findManyCount(criterias: {}): Promise<number> {
    return this.repository.count(criterias).exec();
  }

  async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
    const id = new Types.ObjectId(subDocumentId);
    return this.repository.count({}).where(subDocumentName).equals(id).exec();
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
