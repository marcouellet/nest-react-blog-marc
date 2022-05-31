import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { User } from '../../src/core/entities';
import { UserDto, UpdateUserDto } from '../../src/core/dtos';
import { testUser, testUserDto, testUpdateUserCriterias } from '../data/user.data';

const UserFactoryServiceProvider = {
    provide: UserFactoryService,
    useValue: {
        createUser: jest.fn().mockImplementation((userDto: UserDto) => testUser),
        updateUser: jest.fn().mockImplementation((userDto: UserDto) => testUser),
        createUserDto: jest.fn().mockImplementation((user: User) => testUserDto),
        createUpdateUserCriterias: jest.fn().mockImplementation((updateUserDto: UpdateUserDto) => testUpdateUserCriterias),
        removeRestrictedProperties: jest.fn().mockImplementation((user: UserDto): UserDto => testUserDto),
    },
};

export default UserFactoryServiceProvider;
