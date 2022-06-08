import { User } from '../../src/core/entities';
import { UserCriterias } from '../../src/core/find-criterias/user.criterias';
import { UserRole } from '../../src/core';
import { testUserCount, testUserUnrestricted, testUserAdminUnrestricted } from '../data/user.data';

const UserRepositoryMock = {
    provide: User.name,
    useValue: {
        convertToGenericEntity: jest.fn().mockImplementation((obj) => obj),
        convertFromGenericEntity: jest.fn().mockImplementation((obj) => obj),
        getAll: jest.fn().mockImplementation(() => Promise.resolve([testUserUnrestricted])),
        get: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
        findOne: jest.fn().mockImplementation((criterias: UserCriterias) => {
            let user: User;
            if (!criterias.hasOwnProperty('email') || criterias['email'] !== 'unknown@gmail.com'){
                user = testUserUnrestricted;
                if (criterias.hasOwnProperty('role') && criterias['role'] == UserRole.ADMIN) {
                    user = testUserAdminUnrestricted;
                }
            }
            return Promise.resolve(user);
        }),
        findMany: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve([testUserUnrestricted])),
        findManyCount: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve(testUserCount)),
        create: jest.fn().mockImplementation((post: User) => Promise.resolve(testUserUnrestricted)),
        update: jest.fn().mockImplementation((id: string, update: {}, populate?: string) => Promise.resolve(testUserUnrestricted)),
        delete: jest.fn().mockImplementation((id: string, populate?: string) => Promise.resolve(testUserUnrestricted)),
    },
};

export default UserRepositoryMock;
