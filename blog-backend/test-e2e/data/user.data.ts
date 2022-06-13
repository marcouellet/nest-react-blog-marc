import { User } from '../../src/core/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto, IUpdateUserCriterias } from '../../src/core/dtos';
import { testE2ERoleUser, testE2ERoleAdmin, testE2EDummyUserEmail, testE2EAdminUserEmail, testE2EDummyUserPassword, 
    testE2EUnknownUserName, testE2EAdminUserPassword, testE2EDummyUserName, testE2EAdminUserName,
    testE2EUnknownUserEmail, testE2EUnknownUserPassword } from './auth.data';
import { UserCriterias } from '../../src/core';

export const testE2EUnknownUserNameUpdated = 'e2eunknown_updated';
export const testE2EUnknownUserPasswordUpdated = 'e2unknown-password_updated';
export const testE2EFindDummyUserCriterias: UserCriterias = { email: testE2EDummyUserEmail, role: testE2ERoleUser };
export const testE2EFindAdminUserCriterias: UserCriterias = { email: testE2EAdminUserEmail, role: testE2ERoleAdmin };
export const testE2EFindUnknownUserNameCriterias: UserCriterias = { username: testE2EUnknownUserNameUpdated };

export const testE2ECreateUnknownUserDto: CreateUserDto = {
    username: testE2EUnknownUserName,
    email: testE2EUnknownUserEmail,
    password: testE2EUnknownUserPassword,
    role: testE2ERoleUser
};

export const testE2EUpdateUnknownUserNameDto: UpdateUserDto = {
    username: testE2EUnknownUserNameUpdated,
    email: testE2EUnknownUserEmail,
    password: testE2EUnknownUserPassword,
    role: testE2ERoleUser
};

export const testE2EUpdateUnknownUserPasswordDto: UpdateUserDto = {
    username: testE2EUnknownUserName,
    email: testE2EUnknownUserEmail,
    password: testE2EUnknownUserPasswordUpdated,
    role: testE2ERoleUser
};

    