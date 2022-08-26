import { AuthService } from '@Services/auth.service';
import { LoginDto, RegisterDto } from '@blog-common/dtos';

import { testJwtPayload } from '../data/auth.data';
import { testUserDto, testUserUnknownDto} from '../data/user.data';

const AuthServiceMock = {
    provide: AuthService,
    useValue: {
      validateToken: jest.fn().mockImplementation((token: string) => Promise.resolve(testJwtPayload)),
      login: jest.fn().mockImplementation((loginDto: LoginDto) => Promise.resolve(testUserDto)),
      register: jest.fn().mockImplementation((registerDto: RegisterDto) => Promise.resolve(testUserUnknownDto)),
    },
};

export default AuthServiceMock;
