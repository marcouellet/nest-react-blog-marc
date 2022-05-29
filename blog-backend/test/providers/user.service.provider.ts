import { UserService } from '../../src/services/user/user.service';
import { LoginDto, RegisterDto, UserDto, UpdateUserDto } from '../../src/core/dtos';
import { testUserDto, testUserDtoUnrestricted} from '../data/user.data';

const UserServiceProvider = {
    provide: UserService,
    useValue: {
      getAllUsers: jest.fn().mockImplementation(() => Promise.resolve([testUserDto])),
      getUserById: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserDto)),
      getUserByIdUnrestricted: jest.fn().mockImplementation((id: string) => Promise.resolve(testUserDtoUnrestricted)),
      findUser: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testUserDto)),
      verifyUserExist: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testUserDto)),
      findUserUnrestricted: jest.fn().mockImplementation((loginDto: LoginDto) => Promise.resolve(testUserDtoUnrestricted)),
      findManyUsers: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve([testUserDto])),
      findManyUsersCount: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve(1)),
      createUser: jest.fn().mockImplementation((userDto: UserDto) => Promise.resolve(testUserDto)),
      updateUser: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => Promise.resolve(testUserDto)),
      deleteUser: jest.fn().mockImplementation((id: string) => Promise.resolve([testUserDto])),
    },
};

export default UserServiceProvider;
