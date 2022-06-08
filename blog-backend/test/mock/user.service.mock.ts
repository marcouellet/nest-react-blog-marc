import { UserService } from '../../src/services/user/user.service';
import { UserDto, UpdateUserDto } from '../../src/core/dtos';
import { UserCriterias } from '../../src/core/find-criterias/user.criterias';
import { testUserUnrestricted, testUserCount } from '../data/user.data';

const UserServiceMock = {
    provide: UserService,
    useValue: {
      getAllUsers: jest.fn().mockImplementation(() => Promise.resolve([testUserUnrestricted])),
      getUserById: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
      findUser: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve(testUserUnrestricted)),
      findManyUsers: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve([testUserUnrestricted])),
      findManyUsersCount: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve(testUserCount)),
      createUser: jest.fn().mockImplementation((userDto: UserDto) => Promise.resolve(testUserUnrestricted)),
      updateUser: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve(testUserUnrestricted)),
      deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserUnrestricted)),
    },
};

export default UserServiceMock;
