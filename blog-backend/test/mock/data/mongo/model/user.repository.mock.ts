import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { User } from '../../../../../src/frameworks/data/mongo/model/user.model';

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
        const users: any = undefined;
        return users as Promise<User[]>;
      }

    async get(id: string): Promise<User> {
        const user: any = undefined;
        return user as Promise<User>;
    }

    async findOne(criterias: {}): Promise<User> {
        const user: any = undefined;
        return user as Promise<User>;
    }

    async findMany(criterias: {}): Promise<User[]> {
        const users: any = undefined;
        return users as Promise<User[]>;
    }

    async findManyCount(criterias: {}): Promise<number> {
        const count: any = undefined;
        return count as Promise<number>;
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        const count: any = undefined;
        return count as Promise<number>;
    }

    async create(item: User): Promise<User> {
        const user: any = undefined;
        return user as Promise<User>;
    }

    async update(id: string, update: {}, populate?: string) {
        const user: any = undefined;
        return user as Promise<User>;
    }

    async delete(id: string, populate?: string): Promise<User> {
        const user: any = undefined;
        return user as Promise<User>;
    }
}
