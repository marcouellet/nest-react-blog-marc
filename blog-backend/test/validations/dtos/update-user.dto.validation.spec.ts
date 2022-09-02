import { validate } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '@Shared/entities/user.entity';
import { UserRole } from '@Shared/enum/user-role.enum';
import { buildUpdateUserDto  } from '@Shared/builders/user.dtos.builders';

import { testCreateUnknownUserDto } from '../../data/user.data';

describe('UpdateUserDto Validation', () => {

  it('should complain for username length too short', async () => {
    const updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength - 1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    const updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.email = '_'.repeat(minimumUserEmailLength ? minimumUserEmailLength - 1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    const updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.password = '_'.repeat(minimumUserPasswordLength ? minimumUserPasswordLength - 1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'password');
  });

  it('should not complain for USER role value', async () => {
    const updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.role = UserRole.USER;
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });

  it('should not complain for ADMIN role value', async () => {
    const updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.role = UserRole.ADMIN;
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });
});
