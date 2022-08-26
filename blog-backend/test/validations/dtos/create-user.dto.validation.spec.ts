import { validate } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '@blog-common/entities/user.entity';
import { UserRole } from '@blog-common/enum/user-role.enum';
import { buildCreateUserDto  } from '@blog-common/builders/user.dtos.builders';

import { testCreateUnknownUserDto } from '../../data/user.data';

describe('CreateUserDto Validation', () => {

  it('should complain for username length too short', async () => {
    const createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength - 1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    const createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.email = '_'.repeat(minimumUserEmailLength ? minimumUserEmailLength - 1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    const createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.password = '_'.repeat(minimumUserPasswordLength ? minimumUserPasswordLength - 1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'password');
  });

  it('should not complain for USER role value', async () => {
    const createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.role = UserRole.USER;
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });

  it('should not complain for ADMIN role value', async () => {
    const createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.role = UserRole.ADMIN;
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });
});
