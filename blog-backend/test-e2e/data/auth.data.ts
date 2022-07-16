import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { UserRole } from '../../src/core/enum';

export const testE2EDummyUserJwtPayload_Auth: JwtPayload = { sub: 'e2e.auth.dummy@email.com', expiresIn: 0};
export const testE2EAdminUserJwtPayload_Auth: JwtPayload = { sub: 'e2e.auth.admin@email.com', expiresIn: 0};
export const testE2EUnknownUserJwtPayload_Auth: JwtPayload = { sub: 'e2e.auth.unknown@email.com', expiresIn: 0};

export const testE2ERoleUser = UserRole.USER.toString();
export const testE2ERoleAdmin = UserRole.ADMIN.toString();
export const testE2EDummyUserEmail_Auth = 'e2e.auth.dummy@email.com';
export const testE2EAdminUserEmail_Auth = 'e2e.auth.admin@email.com';
export const testE2EUnknownUserEmail_Auth = 'e2e.auth.unknown@email.com';
export const testE2ENonExistingUserEmail_Auth= 'e2e.auth.non.existing@email.com';
export const testE2EDummyUserPassword_Auth = 'e2e.auth.dummy.password';
export const testE2EAdminUserPassword_Auth = 'e2e.auth.admin.password';
export const testE2EUnknownUserPassword_Auth = 'e2e.auth.unknown.password';
export const testE2ENonExistingUserPassword_Auth ='e2e.auth.non.existing.password';
export const testE2EDummyUserName_Auth = 'e2e.auth.dummy.name';
export const testE2EAdminUserName_Auth = 'e2e.auth.admin.name';
export const testE2EUnknownUserName_Auth = 'e2e.auth.unknown.name';
export const testE2EDummyUserAuthToken = '';
export const testE2EAdminUserAuthToken = '';

export const testE2ELoginDummyUser_Auth = {
    email: testE2EDummyUserEmail_Auth,
    password: testE2EDummyUserPassword_Auth,
};

export const testE2ELoginAdminUser_Auth = {
    email: testE2EAdminUserEmail_Auth,
    password: testE2EAdminUserPassword_Auth,
};

export const testE2ELoginUnknownUser_Auth = {
    email: testE2EUnknownUserEmail_Auth,
    password: testE2EUnknownUserPassword_Auth,
};

export const testE2ELoginNonExistingUser_Auth = {
    email: testE2ENonExistingUserEmail_Auth,
    password: testE2ENonExistingUserPassword_Auth,
};

export const testE2ERegisterDummyUser_Auth = {
    username: testE2EDummyUserName_Auth,
    email: testE2EDummyUserEmail_Auth,
    password: testE2EDummyUserPassword_Auth,
};

export const testE2ERegisterUnknownUser_Auth = {
    username: testE2EUnknownUserName_Auth,
    email: testE2EUnknownUserEmail_Auth,
    password: testE2EUnknownUserPassword_Auth,
};

export const testE2ERegisterAdminUser_Auth = {
    username: testE2EAdminUserName_Auth,
    email: testE2EAdminUserEmail_Auth,
    password: testE2EAdminUserPassword_Auth,
};
