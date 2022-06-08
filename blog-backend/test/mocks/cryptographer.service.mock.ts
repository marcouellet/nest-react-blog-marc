import { CryptographerService } from '../../src/services/cryptographer.service';

export const passwordHashed = 'password.hashed';

const CryptographerServiceMock = {
    provide: CryptographerService,
    useValue: {
        hashPassword: jest.fn().mockImplementation((password: string) => passwordHashed),
        checkPassword: jest.fn().mockImplementation((saltedPasswordHash: string, candidatePassword: string) => true),
    },
};

export default CryptographerServiceMock;
