import { IAuthToken, JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { LoginDto, RegisterDto } from '../../src/core/dtos';

export const testJwtPayload: JwtPayload = { sub: 'dummy@email.com'};
export const testAuthToken: IAuthToken =  { accessToken: 'token.signed'};

export const testPassword = 'password';
export const testWrongPassword = 'wrong-password';
export const testSecretPassword = 'secret';
export const testNewPassword = 'new-password';
export const testNewSecretPassword = 'new-secret';
export const testDummyEmail = 'dummy@email.com';
export const testNotDummyEmail = 'not-dummy@email.com';
export const testAdminEmail = 'admin@email.com';
export const testUnknownEmail = 'unknown@email.com';
export const testRoleUser = 'user';
export const testRoleAdmin = 'admin';

export const testRequestWithAuthorize = 'Bearer token';

export const testLoginDto: LoginDto = {
    email: testDummyEmail,
    password: testPassword,
};

export const testLoginDtoWithWrongPassword: LoginDto = {
    email: testDummyEmail,
    password: testWrongPassword,
};

export const testNotLoggedInDto: LoginDto = {
    email: testNotDummyEmail,
    password: testPassword,
};

export const testAlreadyLoggedInDto: LoginDto = {
    email: testDummyEmail,
    password: testPassword,
};

export const testLoginUnknownUserDto: LoginDto = {
    email: testUnknownEmail,
    password: testPassword,
};

export const testRegisterUnknownUserDto: RegisterDto = {
    username: 'dummy',
    email: testUnknownEmail,
    password: testPassword,
};

export const testRegisterExistingUserDto: RegisterDto = {
    username: 'dummy',
    email: testDummyEmail,
    password: testPassword,
};
