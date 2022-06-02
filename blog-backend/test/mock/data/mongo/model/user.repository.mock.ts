import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../../../src/core';
import { IGenericDataRepository } from '../../../../../src/core/abstracts/generic-data-repository.abstract';
import { User } from '../../../../../src/core/entities';
import { UserCriterias } from '../../../../../src/core/find-criterias/user.criterias';
import { testUserUnrestricted, testUserAdminUnrestricted, testUserCount, testUserPostsCount } from '../../../../data/user.data';

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

    async findOne(criterias: UserCriterias): Promise<User> {
        let user: User;
        if (!criterias.hasOwnProperty('email') || criterias['email'] !== 'unknown@gmail.com'){
            user = testUserUnrestricted;
            if (criterias.hasOwnProperty('role') && criterias['role'] == UserRole.ADMIN) {
                user = testUserAdminUnrestricted;
            }
        }
       return Promise.resolve(user);
    }

    async findMany(criterias: UserCriterias): Promise<User[]> {
        return Promise.resolve([testUserUnrestricted]);
    }

    async findManyCount(criterias: UserCriterias): Promise<number> {
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
