
import { JwtPayload } from 'shared/interfaces/jwt.interface';

export const testToken = 'token';
export const testSignResult = 'token.signed';
export const testVerifyResult: JwtPayload = { sub: 'dummy@email.com', exp: undefined, expiresIn: 300 };
