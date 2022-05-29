import { User } from '../../src/core/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto, RegisterDto, IUpdateUserCriterias } from '../../src/core/dtos';
import { testAuthToken } from './auth.data';

const createdOnDate: Date = new Date();

export const testUser: User = {
  id: '1',
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  createdOn: createdOnDate,
};

export const testUserUnrestricted: User = {
  id: '1',
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'password',
  role: 'user',
  createdOn: createdOnDate,
};

export const testUserDto: UserDto = {
  id: '1',
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testUserDtoUnrestricted: UserDto = {
  id: '1',
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testCreateUserDto: CreateUserDto = {
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
};

export const testUpdateUserDto: UpdateUserDto = {
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
};

export const testRequestWithAuthorizeAndUser: any = {
    headers: {
        authorization: 'token',
    },
    user: testUserDto,
};

export const testUpdateUserCriterias: IUpdateUserCriterias = {
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
};

export const testFindUserCriterias = { email: 'dummy@gmail.com' };
