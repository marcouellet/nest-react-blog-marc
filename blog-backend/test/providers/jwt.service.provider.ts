import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { testSignResult, testVerifyResult } from '../data/token.data';

const JwtServiceProvider = {
    provide: JwtService,
    useValue: {
        sign: jest.fn().mockImplementation((payload: string, options?: JwtSignOptions): string => testSignResult),
        verifyAsync: jest.fn().mockImplementation(<T>(token: string): Promise<T> => Promise.resolve((testVerifyResult as unknown) as T)),
     },
};

export default JwtServiceProvider;
