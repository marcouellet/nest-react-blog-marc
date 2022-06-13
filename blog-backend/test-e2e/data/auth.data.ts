import { IAuthToken, JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { UserRole } from '../../src/core/enum';

export const testE2EDummyUserJwtPayload: JwtPayload = { sub: 'e2edummy@email.com'};
export const testE2EAdminUserJwtPayload: JwtPayload = { sub: 'e2eadmin@email.com'};

export const testE2ERoleUser = UserRole.USER.toString();
export const testE2ERoleAdmin = UserRole.ADMIN.toString();
export const testE2EDummyUserEmail = 'e2edummy@email.com';
export const testE2EAdminUserEmail = 'e2eadmin@email.com';
export const testE2EUnknownUserEmail = 'e2eunknown@email.com';
export const testE2EDummyUserPassword = 'e2edummy-password';
export const testE2EAdminUserPassword = 'e2eadmin-password';
export const testE2EUnknownUserPassword = 'e2unknown-password';
export const testE2EDummyUserName = 'e2edummy';
export const testE2EAdminUserName = 'e2eadmin';
export const testE2EUnknownUserName = 'e2eunknown';
export const testE2EDummyUserAuthToken = '';
export const testE2EAdminUserAuthToken = '';

export const testE2ELoginDummyUser = {
    email: testE2EDummyUserEmail,
    password: testE2EDummyUserPassword,
};

export const testE2ELoginAdminUser = {
    email: testE2EAdminUserEmail,
    password: testE2EAdminUserPassword,
};

export const testE2ERegisterDummyUser = {
    username: testE2EDummyUserName,
    email: testE2EDummyUserEmail,
    password: testE2EDummyUserPassword,
};

export const testE2ERegisterUnknownUser = {
    username: testE2EUnknownUserName,
    email: testE2EUnknownUserEmail,
    password: testE2EUnknownUserPassword,
};

export const testE2ERegisterAdminUser = {
    username: testE2EAdminUserName,
    email: testE2EAdminUserEmail,
    password: testE2EAdminUserPassword,
};
