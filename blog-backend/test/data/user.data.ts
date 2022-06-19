import { User } from '../../src/core/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserDto, IUpdateUserCriterias } from '../../src/core/dtos';
import { testAuthToken, testPassword, testSecretPassword, testNewPassword, testDummyEmail, testAdminEmail, testUnknownEmail,
          testRoleUser, testRoleAdmin } from './auth.data';

const createdOnDate: Date = new Date();

export const testUserId = 'abcdefghijkl';
export const testUserCount = 1;

export const testUser: User = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  role: testRoleUser,
  createdOn: createdOnDate,
};

export const testUserUnrestricted: User = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  password: testSecretPassword,
  role: testRoleUser,
  createdOn: createdOnDate,
};

export const testUserAdminUnrestricted: User = {
  id: testUserId,
  username: 'admin',
  email: testAdminEmail,
  password: testSecretPassword,
  role: testRoleAdmin,
  createdOn: createdOnDate,
};

export const testUserDto: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  role: testRoleUser,
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testUserUnknownDto: UserDto = {
  id: testUserId,
  username: 'unknown',
  email: testUnknownEmail,
  role: testRoleUser,
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testUserAdminDto: UserDto = {
  id: testUserId,
  username: 'admin',
  email: testAdminEmail,
  role: testRoleAdmin,
  createdOn: createdOnDate,
};

export const testUserDtoUnrestricted: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  password: testSecretPassword,
  role: testRoleUser,
  authtoken: testAuthToken,
  authrefreshtoken: testAuthToken,
  createdOn: createdOnDate,
};

export const testCreateExistingUserDto: CreateUserDto = {
  username: 'dummy',
  email: testDummyEmail,
  password: testPassword,
  role: testRoleUser,
};

export const testCreateUnknownUserDto: CreateUserDto = {
  username: 'dummy',
  email: testUnknownEmail,
  password: testPassword,
  role: testRoleUser,
};

export const testUpdateUserDto: UpdateUserDto = {
  username: 'dummy',
  email: testDummyEmail,
  password: testSecretPassword,
  role: testRoleUser,
};

export const testUpdateUserNoPasswordSuppliedDto: UpdateUserDto = {
  username: 'dummy',
  email: testDummyEmail,
  role: testRoleUser,
};

export const testUpdateUserSamePasswordSuppliedDto: UpdateUserDto = {
  username: 'dummy',
  email: testDummyEmail,
  password: testPassword,
  role: testRoleUser,
};

export const testUpdateUserNewPasswordSuppliedDto: UpdateUserDto = {
  username: 'dummy',
  email: testDummyEmail,
  password: testNewPassword,
  role: testRoleUser,
};

export const testUpdateUserCriterias: IUpdateUserCriterias = {
  username: 'dummy',
  email: testDummyEmail,
  password: testSecretPassword,
  role: testRoleUser,
};

export const testServiceUser: User = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  role: testRoleUser,
  createdOn: createdOnDate,
};

export const testServiceUserDto: UserDto = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  role: testRoleUser,
  createdOn: createdOnDate,
};

export const testServiceUserDtoUnrestricted: UserDto  = {
  id: testUserId,
  username: 'dummy',
  email: testDummyEmail,
  password: testSecretPassword,
  role: testRoleUser,
  createdOn: createdOnDate,
};

export const testFindUserCriterias = { email: testDummyEmail, role: testRoleUser };
export const testFindUserAdminCriterias = { email: testAdminEmail, role: testRoleAdmin };

export const testFindUserWithDummyUserEmailCriterias = { email: testDummyEmail };
export const testFindUserWithUnknownUserEmailCriterias = { email: testUnknownEmail };
