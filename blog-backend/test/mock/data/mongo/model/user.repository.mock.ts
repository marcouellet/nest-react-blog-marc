import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { User } from '../../../../../src/core/entities';
import { testUser } from '../../../../data/user.data';

@Injectable()
export class UserRepositoriesMock implements IGenericDataRepository<User> {

    convertToGenericEntity(obj: any): User {
        const newObj = obj;
        newObj.id = obj._id.toString();
        delete newObj._id;
        return newObj;
      }

      convertFromGenericEntity(obj: any): User {
        const newObj = obj;
        obj._id = obj.id;
        delete newObj.id;
        return newObj;
      }

    async getAll(): Promise<User[]> {
        return Promise.resolve([testUser]);
    }

    async get(id: string): Promise<User> {
        return Promise.resolve(testUser);
    }

    async findOne(criterias: {}): Promise<User> {
        return Promise.resolve(testUser);
    }

    async findMany(criterias: {}): Promise<User[]> {
        return Promise.resolve([testUser]);
    }

    async findManyCount(criterias: {}): Promise<number> {
        return Promise.resolve(1);
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        return Promise.resolve(1);
    }

    async create(item: User): Promise<User> {
        return Promise.resolve(testUser);
    }

    async update(id: string, update: {}, populate?: string) {
        return Promise.resolve(testUser);
    }

    async delete(id: string, populate?: string): Promise<User> {
        return Promise.resolve(testUser);
    }
}
