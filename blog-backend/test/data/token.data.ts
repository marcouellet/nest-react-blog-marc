
import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { testJwtPayload } from '../data/auth.data';

export const testSignResult = 'token.signed';
export const testVerifyResult: JwtPayload = testJwtPayload;
