import { UserFactoryService } from '../../src/services/user/user-factory.service';
import { User } from '../../src/core/entities';
import { UserDto, UpdateUserDto } from '../../src/core/dtos';
import { testServiceUser, testServiceUserDto, testUpdateUserCriterias } from '../data/user.data';

const UserFactoryServiceProvider = {
    provide: UserFactoryService,
    useValue: {
        createUser: jest.fn().mockImplementation((userDto: UserDto) => testServiceUser),
        updateUser: jest.fn().mockImplementation((userDto: UserDto) => testServiceUser),
        createUserDto: jest.fn().mockImplementation((user: User) => testServiceUserDto),
        createUpdateUserCriterias: jest.fn().mockImplementation((updateUserDto: UpdateUserDto) => testUpdateUserCriterias),
        removeRestrictedProperties: jest.fn().mockImplementation((user: UserDto): UserDto => testServiceUserDto),
    },
};

export default UserFactoryServiceProvider;
