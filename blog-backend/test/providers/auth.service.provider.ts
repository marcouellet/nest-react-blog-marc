import { AuthService } from '../../src/services/auth.service';
import { LoginDto, RegisterDto } from '../../src/core/dtos';
import { testJwtPayload } from '../data/auth.data';
import { testUserDto, testUserUnknownDto} from '../data/user.data';

const AuthServiceProvider = {
    provide: AuthService,
    useValue: {
      validateToken: jest.fn().mockImplementation((token: string) => Promise.resolve(testJwtPayload)),
      login: jest.fn().mockImplementation((loginDto: LoginDto) => Promise.resolve(testUserDto)),
      register: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve(testUserUnknownDto)),
    },
};

export default AuthServiceProvider;
