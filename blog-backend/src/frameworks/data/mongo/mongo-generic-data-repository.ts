import { Model, Types } from 'mongoose';
import { IGenericDataRepository } from '../../../core/repositories';
export class MongoGenericDataRepository<T> implements IGenericDataRepository<T> {

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

  async findManyCountForSubDocument(subDocumentName: string, subDocumentId: string): Promise<number> {
    const id = new Types.ObjectId(subDocumentId);
    return this.repository.count({}).where(subDocumentName).equals(id).exec();
  }

  async findManyForSubDocument(subDocumentName: string, subDocumentId: string): Promise<T[]> {
    const id = new Types.ObjectId(subDocumentId);
    return this.repository.where(subDocumentName).equals(id).exec();
  }

  async create(item: T): Promise<T> {
    return this.repository.create(item) as Promise<T>;
  }

  async unset (id: string, unsetParms: {}): Promise<void> {
    this.repository.updateOne({_id: id}, { $unset: unsetParms }).exec();
  }

  async update(id: string, update: {}, populate?: string | string[]): Promise<T> {

    const options: {[key: string]: any} = { new: true }
    if (populate) {
      options.populate = populate;
    }

    return this.repository.findByIdAndUpdate(id, update, options).exec();
  }

  async delete(id: string, populate?: string | string[]): Promise<T> {
    const options: {[key: string]: any} = { new: true }
    if (populate) {
      options.populate = populate;
    }
    return this.repository.findByIdAndDelete(id, options).exec();
  }
}
