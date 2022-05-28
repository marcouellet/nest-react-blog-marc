import { User } from '../../src/core/entities/user.entity';
import { JwtPayload } from '../../src/auth/interfaces/jwt.interface';

const createdOnDate: Date = new Date();

export const testUser: User = {
    id: '1',
    username: 'rogatien',
    email: 'rogation@gmail.com',
    password: 'secret',
    role: 'user',
    createdOn: createdOnDate,
  };

export const testUserResponse: User = {
    id: '1',
    username: 'rogatien',
    email: 'rogation@gmail.com',
    role: 'user',
    createdOn: createdOnDate,
  };

export const whoAmITestResponse: JwtPayload = {sub: 'dummy@gmail.com'};
