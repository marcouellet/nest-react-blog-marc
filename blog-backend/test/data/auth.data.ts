import { IAuthToken, JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { LoginDto, RegisterDto } from '../../src/core/dtos';

export const testJwtPayload: JwtPayload = { sub: 'dummy@email.com'};
export const testAuthToken: IAuthToken =  { accessToken: 'token.signed'};

export const testRequestWithAuthorize: any = {
    headers: {
        authorization: 'token',
    },
};

export const testLoginDto: LoginDto = {
    email: 'dummy@email.com',
    password: 'password',
};

export const testNotLoggedInDto: LoginDto = {
    email: 'not-dummy@email.com',
    password: 'password',
};

export const testAlreadyLoggedInDto: LoginDto = {
    email: 'dummy@email.com',
    password: 'password',
};

export const testLoginUnknownUserDto: LoginDto = {
    email: 'unknown@email.com',
    password: 'password',
};

export const testRegisterUnknownUserDto: RegisterDto = {
    username: 'dummy',
    email: 'unknown@email.com',
    password: 'password',
};

export const testRegisterExistingUserDto: RegisterDto = {
    username: 'dummy',
    email: 'dummy@email.com',
    password: 'password',
};

