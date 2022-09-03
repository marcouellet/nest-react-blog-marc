import { User } from 'shared/entities';
import { UserFindCriterias } from 'shared/find-criterias/user.find-criterias';
import { UserRole } from 'shared/enum';
import { testUserCount, testUserUnrestricted, testUserAdminUnrestricted } from '../data/user.data';
import { testUnknownEmail } from '../data/auth.data';

const UserRepositoryMock = {
    provide: User.name,
    useValue: {
        convertToGenericEntity: jest.fn().mockImplementation((obj) => obj),
        convertFromGenericEntity: jest.fn().mockImplementation((obj) => obj),
        getAll: jest.fn().mockImplementation(() => Promise.resolve([testUserUnrestricted])),
        get: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
        findOne: jest.fn().mockImplementation((criterias: UserFindCriterias) => {
            let user: User;
            if (!criterias.hasOwnProperty('email') || criterias.email !== testUnknownEmail){
                user = testUserUnrestricted;
                if (criterias.hasOwnProperty('role') && criterias.role === UserRole.ADMIN) {
                    user = testUserAdminUnrestricted;
                }
            }
            return Promise.resolve(user);
        }),
        findMany: jest.fn().mockImplementation((criterias: UserFindCriterias) => Promise.resolve([testUserUnrestricted])),
        findManyCount: jest.fn().mockImplementation((criterias: UserFindCriterias) => Promise.resolve(testUserCount)),
        create: jest.fn().mockImplementation((post: User) => Promise.resolve(testUserUnrestricted)),
        unset: jest.fn().mockImplementation((id: string, unserParms: {}) => Promise.resolve()),
        update: jest.fn().mockImplementation((id: string, update: {}, populate?: string) => Promise.resolve(testUserUnrestricted)),
        delete: jest.fn().mockImplementation((id: string, populate?: string) => Promise.resolve(testUserUnrestricted)),
    },
};

export default UserRepositoryMock;
