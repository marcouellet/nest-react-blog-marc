import { Types } from 'mongoose';
import { IGenericDataRepository } from './generic-data-repository.interface';

export class GenericDataRepository<T> implements IGenericDataRepository<T> {

  constructor(private readonly repository: IGenericDataRepository<T>, private readonly populateOnFind: string[] = []) {}

  convertToGenericEntity(obj: any): T {
    return this.repository.convertToGenericEntity(obj);
  }

  convertFromGenericEntity(obj: any): T {
    return this.repository.convertFromGenericEntity(obj);
  }

  async getAll(): Promise<T[]> {
    return this.repository.getAll();
  }

  async get(id: string): Promise<T> {
    return this.repository.get(id);
  }

  async findOne(criterias: {}): Promise<T> {
    return this.repository.findOne(criterias);
  }

  async findMany(criterias: {}): Promise<T[]> {
    return this.repository.findMany(criterias);
  }

  async findManyCount(criterias: {}): Promise<number> {
    return this.repository.findManyCount(criterias);
  }

  async findManyCountForSubDocument(subDocumentName: string, subDocumentId: string, criterias: {}): Promise<number> {
    return this.repository.findManyCountForSubDocument(subDocumentName, subDocumentId, criterias);
  }

  async findManyForSubDocument(subDocumentName: string, subDocumentId: string, criterias: {}): Promise<T[]> {
    return this.repository.findManyForSubDocument(subDocumentName, subDocumentId, criterias);
  }

  async create(item: T): Promise<T> {
    return this.repository.create(item);
  }

  async unset(id: string, unsetParms: {}): Promise<void> {
    return this.repository.unset(id, unsetParms);
  }

  async update(id: string, update: {}, populate?: string | string[]): Promise<T> {
    return this.repository.update(id, update, populate);
  }

  async delete(id: string, populate?: string | string[]): Promise<T> {
    return await this.repository.delete(id, populate);
  }
}
