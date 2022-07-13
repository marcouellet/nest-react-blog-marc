import { Model, Types } from 'mongoose';
import { IGenericDataRepository } from '../../../core/repositories';
import { buildMongoFindCriterias } from './mongo.filter.find-criterias';
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
    const findCriterias = buildMongoFindCriterias(criterias);
    return this.repository.findOne(findCriterias).populate(this.populateOnFind).exec() as Promise<T>;
  }

  async findMany(criterias: {}): Promise<T[]> {
    const findCriterias = buildMongoFindCriterias(criterias);
    return this.repository.find(findCriterias).populate(this.populateOnFind).exec() as Promise<T[]>;
  }

  async findManyCount(criterias: {}): Promise<number> {
    const findCriterias = buildMongoFindCriterias(criterias);
    return this.repository.count(findCriterias).exec();
  }

  async findManyCountForSubDocument(subDocumentName: string, subDocumentId: string, criterias: {}): Promise<number> {
    const findCriterias = buildMongoFindCriterias(criterias);
    if (subDocumentId) {
      const id = new Types.ObjectId(subDocumentId); 
      return this.repository.count(findCriterias).where(subDocumentName).equals(id).exec();
    } else {
      let crit = {...findCriterias};
      crit[subDocumentName] = { $exists: false }
      return this.repository.count(crit).where(subDocumentName).exec();
    }
  }

  async findManyForSubDocument(subDocumentName: string, subDocumentId: string, criterias: {}): Promise<T[]> {
    const findCriterias = buildMongoFindCriterias(criterias);
    if (subDocumentId) {
      const id = new Types.ObjectId(subDocumentId); 
      return this.repository.find(findCriterias).where(subDocumentName).equals(id).populate(this.populateOnFind).exec();
    } else {
      let crit = {...findCriterias};
      crit[subDocumentName] = { $exists: false }
      return this.repository.find(crit).where(subDocumentName).populate(this.populateOnFind).exec();
    }
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
