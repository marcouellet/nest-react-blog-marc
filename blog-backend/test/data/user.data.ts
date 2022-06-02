import { User } from '../../src/core/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto, RegisterDto, IUpdateUserCriterias } from '../../src/core/dtos';
import { UserCriterias } from '../../src/core/find-criterias/user.criterias';
import { testAuthToken } from './auth.data';

const createdOnDate: Date = new Date();

export const testUserId = 'abcdefghijkl';
export const testUserCount = 1;
export const testServiceUserCount = 1;
export const testUserPostsCount = 1;

export const testUser: User = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  createdOn: createdOnDate,
};

export const testUserUnrestricted: User = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
  createdOn: createdOnDate,
};

export const testUserAdminUnrestricted: User = {
  id: testUserId,
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'secret',
  role: 'admin',
  createdOn: createdOnDate,
};

export const testUserDto: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testUserUnknownDto: UserDto = {
  id: testUserId,
  username: 'unknown',
  email: 'unknown@gmail.com',
  role: 'user',
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testUserAdminDto: UserDto = {
  id: testUserId,
  username: 'admin',
  email: 'admin@gmail.com',
  role: 'admin',
  createdOn: createdOnDate,
};

export const testUserDtoUnrestricted: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testCreateExistingUserDto: CreateUserDto = {
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'password',
  role: 'user',
};

export const testCreateNonExistingUserDto: CreateUserDto = {
  username: 'dummy',
  email: 'unknown@gmail.com',
  password: 'password',
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

export const testServiceUser: User = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  createdOn: createdOnDate,
};

export const testServiceUserDto: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  role: 'user',
  createdOn: createdOnDate,
};

export const testServiceUserAdminDto: UserDto = {
  id: testUserId,
  username: 'admin',
  email: 'admin@gmail.com',
  role: 'admin',
  createdOn: createdOnDate,
};

export const testServiceUserDtoUnrestricted: UserDto  = {
  id: testUserId,
  username: 'dummy',
  email: 'dummy@gmail.com',
  password: 'secret',
  role: 'user',
  createdOn: createdOnDate,
};

export const testRepositoryUserUnrestricted = testUserUnrestricted;
export const testRepositoryUserDtoUnrestricted = testServiceUserDtoUnrestricted;

export const testFindUserCriterias = { email: 'dummy@gmail.com', role: 'user' };
export const testFindUserAdminCriterias = { email: 'admin@gmail.com', role: 'admin' };
