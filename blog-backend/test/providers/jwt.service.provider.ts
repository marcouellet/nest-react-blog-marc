import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';
import { testSignResult, testVerifyResult } from '../data/token.data';

const JwtServiceProvider = {
    provide: JwtService,
    useValue: {
        sign: jest.fn().mockImplementation((payload: string, options: JwtSignOptions): string => testSignResult),
        verifyAsync: jest.fn().mockImplementation(<T>(token: string): T => (testVerifyResult as unknown) as T),
    },
};

export default JwtServiceProvider;
