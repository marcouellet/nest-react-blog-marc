import { Injectable } from '@nestjs/common';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { User } from '../../../../../src/core/entities';
import { testUserUnrestricted, testUserCount, testUserPostsCount } from '../../../../data/user.data';

@Injectable()
export class UserRepositoriesMock implements IGenericDataRepository<User> {

    convertToGenericEntity(obj: any): User {
        return obj;
    }

    convertFromGenericEntity(obj: any): User {
        return obj;
    }

    async getAll(): Promise<User[]> {
        return Promise.resolve([testUserUnrestricted]);
    }

    async get(id: string): Promise<User> {
        return Promise.resolve(testUserUnrestricted);
    }

    async findOne(criterias: {}): Promise<User> {
        return Promise.resolve(testUserUnrestricted);
    }

    async findMany(criterias: {}): Promise<User[]> {
        return Promise.resolve([testUserUnrestricted]);
    }

    async findManyCount(criterias: {}): Promise<number> {
        return Promise.resolve(testUserCount);
    }

    async findManyCountForSubDocumentId(subDocumentName: string, subDocumentId: string): Promise<number> {
        return Promise.resolve(testUserPostsCount);
    }

    async create(item: User): Promise<User> {
        return Promise.resolve(testUserUnrestricted);
    }

    async update(id: string, update: {}, populate?: string) {
        return Promise.resolve(testUserUnrestricted);
    }

    async delete(id: string, populate?: string): Promise<User> {
        return Promise.resolve(testUserUnrestricted);
    }
}
