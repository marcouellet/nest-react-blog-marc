import { IAuthToken, JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { LoginDto, RegisterDto } from '../../src/core/dtos';
import { testSignResult } from './token.data';

export const testJwtPayload: JwtPayload = { sub: 'dummy@email.com'};
export const testAuthToken: IAuthToken =  { accessToken: testSignResult};

export const testRequestWithAuthorize: any = {
    headers: {
        authorization: 'token',
    },
};

export const testNotLoggedInDto: LoginDto = {
    email: 'not-dummy@gmail.com',
    password: 'password',
};

export const testAlreadyLoggedInDto: LoginDto = {
    email: 'dummy@gmail.com',
    password: 'password',
};

export const testNotRegisteredDto: RegisterDto = {
    username: 'dummy',
    email: 'not-dummy@gmail.com',
    password: 'password',
};

export const testAlreadyRegisteredDto: RegisterDto = {
    username: 'dummy',
    email: 'dummy@gmail.com',
    password: 'password',
};
