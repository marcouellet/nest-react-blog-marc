import { CryptographerService } from '../../src/services/cryptographer.service';
import { testPassword, testSecretPassword, testNewPassword, testNewSecretPassword } from '../data/auth.data';

export const passwordHashed = 'password.hashed';

const CryptographerServiceMock = {
    provide: CryptographerService,
    useValue: {
        hashPassword: jest.fn().mockImplementation((password: string) => {
            if (password === testPassword) {
                return testSecretPassword;
            }
            if (password === testNewPassword) {
                return testNewSecretPassword;
            }
        }),
        checkPassword: jest.fn().mockImplementation((saltedPasswordHash: string, candidatePassword: string) => {
            return (saltedPasswordHash === testSecretPassword && candidatePassword === testPassword);
        }),
    },
};

export default CryptographerServiceMock;
