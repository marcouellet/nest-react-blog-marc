
import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';

export const testToken = 'token';
export const testSignResult = 'token.signed';
export const testVerifyResult: JwtPayload = { sub: 'dummy@email.com', expiresIn: 300 };
