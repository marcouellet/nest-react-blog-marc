import { UserService } from '@Services/user/user.service';
import { UserDto, UpdateUserDto } from '@blog-common/dtos';
import { UserFindCriterias } from '@blog-common/find-criterias';

import { testUserUnrestricted, testUserCount } from '../data/user.data';

const UserServiceMock = {
    provide: UserService,
    useValue: {
      getAllUsers: jest.fn().mockImplementation(() => Promise.resolve([testUserUnrestricted])),
      getUser: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
      findUser: jest.fn().mockImplementation((criterias: UserFindCriterias) => Promise.resolve(testUserUnrestricted)),
      findManyUsers: jest.fn().mockImplementation((criterias: UserFindCriterias) => Promise.resolve([testUserUnrestricted])),
      findManyUsersCount: jest.fn().mockImplementation((criterias: UserFindCriterias) => Promise.resolve(testUserCount)),
      createUser: jest.fn().mockImplementation((userDto: UserDto) => Promise.resolve(testUserUnrestricted)),
      updateUser: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve(testUserUnrestricted)),
      deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
    },
};

export default UserServiceMock;
