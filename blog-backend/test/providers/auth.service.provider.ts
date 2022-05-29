import { AuthService } from '../../src/services/auth.service';
import { LoginDto, RegisterDto } from '../../src/core/dtos';
import { testJwtPayload } from '../data/auth.data';
import { testUserDto} from '../data/user.data';

const AuthServiceProvider = {
    provide: AuthService,
    useValue: {
      getUserFromToken: jest.fn().mockImplementation((token: string) => Promise.resolve(testUserDto)),
      validateToken: jest.fn().mockImplementation((token: string) => Promise.resolve(testJwtPayload)),
      validateRefreshToken: jest.fn().mockImplementation((token: string) => Promise.resolve(testJwtPayload)),
      validateUser: jest.fn().mockImplementation((criterias: {}, isAdminRequired: boolean = false) => Promise.resolve(testUserDto)),
      validateUserUnrestricted: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testUserDto)),
      login: jest.fn().mockImplementation((loginDto: LoginDto) => Promise.resolve(testUserDto)),
      register: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve(testUserDto)),
    },
};

export default AuthServiceProvider;
