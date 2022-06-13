import { CreateUserDto, UpdateUserDto } from '../../src/core/dtos';
import { testE2ERoleUser, testE2ERoleAdmin } from './auth.data';
import { UserCriterias } from '../../src/core';

export const testE2EDummyUserPostTitle_User = 'dummy title';
export const testE2EDummyUserPostUpdatedTitle_User = 'dummy updated title';
export const testE2ENonExistingUserPostTitle_User = 'non existing title';
export const testE2EDummyUserEmail_User = 'e2e.user.dummy.user@email.com';
export const testE2EAdminUserEmail_User = 'e2e.user.admin.user@email.com';
export const testE2EUnknownUserEmail_User = 'e2e.user.unknown.user@email.com';
export const testE2EDummyUserPassword_User = 'e2e.user.dummy.user-password';
export const testE2EAdminUserPassword_User = 'e2e.user.admin.user-password';
export const testE2EUnknownUserPassword_User = 'e2e.user.unknown.user-password';
export const testE2EDummyUserName_User = 'e2e.user.dummy.user';
export const testE2EAdminUserName_User = 'e2e.user.admin.user';
export const testE2EUnknownUserName_User = 'e2e.user.unknown.user';

export const testE2ENonExistingUserId_User= 'twelvelong12'; // required by MongoDB
export const testE2EUnknownUserNameUpdated_User = 'e2e.user.unknown.user_updated';
export const testE2EUnknownUserPasswordUpdated_User = 'e2e.user.unknown.user-password_updated';
export const testE2EFindDummyUserCriterias_User: UserCriterias = { email: testE2EDummyUserEmail_User, role: testE2ERoleUser };
export const testE2EFindAdminUserCriterias_User: UserCriterias = { email: testE2EAdminUserEmail_User, role: testE2ERoleAdmin };
export const testE2EFindUnknownUserNameCriterias_User: UserCriterias = { username: testE2EUnknownUserNameUpdated_User };

export const testE2ERegisterDummyUser_User = {
    username: testE2EDummyUserName_User,
    email: testE2EDummyUserEmail_User,
    password: testE2EDummyUserPassword_User,
};

export const testE2ERegisterUnknownUser_User = {
    username: testE2EUnknownUserName_User,
    email: testE2EUnknownUserEmail_User,
    password: testE2EUnknownUserPassword_User,
};

export const testE2ERegisterAdminUser_User = {
    username: testE2EAdminUserName_User,
    email: testE2EAdminUserEmail_User,
    password: testE2EAdminUserPassword_User,
};

export const testE2ECreateUnknownUserDto_User: CreateUserDto = {
    username: testE2EUnknownUserName_User,
    email: testE2EUnknownUserEmail_User,
    password: testE2EUnknownUserPassword_User,
    role: testE2ERoleUser
};

export const testE2EUpdateUnknownUserNameDto_User: UpdateUserDto = {
    username: testE2EUnknownUserNameUpdated_User,
    email: testE2EUnknownUserEmail_User,
    password: testE2EUnknownUserPassword_User,
    role: testE2ERoleUser
};

export const testE2EUpdateUnknownUserPasswordDto_User: UpdateUserDto = {
    username: testE2EUnknownUserName_User,
    email: testE2EUnknownUserEmail_User,
    password: testE2EUnknownUserPasswordUpdated_User,
    role: testE2ERoleUser
};

    