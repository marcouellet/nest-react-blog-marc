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

export const testLoginDto: LoginDto = {
    email: 'dummy@gmail.com',
    password: 'password',
};

export const testRegisterDto: RegisterDto = {
    username: 'dummy',
    email: 'dummy@gmail.com',
    password: 'password',
};
