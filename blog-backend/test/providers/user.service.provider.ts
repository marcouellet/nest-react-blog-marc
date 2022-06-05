import { UserService } from '../../src/services/user/user.service';
import { UserDto, UpdateUserDto } from '../../src/core/dtos';
import { UserCriterias } from '../../src/core/find-criterias/user.criterias';
import { testServiceUserCount, testServiceUserDto, testServiceUserDtoUnrestricted} from '../data/user.data';

const UserServiceProvider = {
    provide: UserService,
    useValue: {
      getAllUsers: jest.fn().mockImplementation(() => Promise.resolve([testServiceUserDto])),
      getUserById: jest.fn().mockImplementation((id: string) => Promise.resolve(testServiceUserDto)),
      findUser: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve(testServiceUserDto)),
      findManyUsers: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve([testServiceUserDto])),
      findManyUsersCount: jest.fn().mockImplementation((criterias: UserCriterias) => Promise.resolve(testServiceUserCount)),
      createUser: jest.fn().mockImplementation((userDto: UserDto) => Promise.resolve(testServiceUserDto)),
      updateUser: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve(testServiceUserDto)),
      deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve(testServiceUserDto)),
    },
};

export default UserServiceProvider;
