import { UserService } from '../../src/services/user/user.service';
import { LoginDto, RegisterDto, UserDto, UpdateUserDto } from '../../src/core/dtos';
import { testUserCount, testServiceUserDto, testServiceUserDtoUnrestricted} from '../data/user.data';

const UserServiceProvider = {
    provide: UserService,
    useValue: {
      getAllUsers: jest.fn().mockImplementation(() => Promise.resolve([testServiceUserDto])),
      getUserById: jest.fn().mockImplementation((id: string) => Promise.resolve(testServiceUserDto)),
      getUserByIdUnrestricted: jest.fn().mockImplementation((id: string) => Promise.resolve(testServiceUserDtoUnrestricted)),
      findUser: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testServiceUserDto)),
      verifyUserExist: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testServiceUserDto)),
      findUserUnrestricted: jest.fn().mockImplementation((loginDto: LoginDto) => Promise.resolve(testServiceUserDtoUnrestricted)),
      findManyUsers: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve([testServiceUserDto])),
      findManyUsersCount: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve(testUserCount)),
      createUser: jest.fn().mockImplementation((userDto: UserDto) => Promise.resolve(testServiceUserDto)),
      updateUser: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve(testServiceUserDto)),
      deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve(testServiceUserDto)),
    },
};

export default UserServiceProvider;
