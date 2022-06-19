import { validate } from '@nestjs/class-validator';
import { testCreateUnknownUserDto } from '../../data/user.data';
import { buildUpdateUserDto  } from '../../builders/user.dtos.builders';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../../../src/core/entities/user.entity';
import { UserRole } from '../../../src/core/enum/user-role.enum';

describe('UpdateUserDto Validation', () => {

  it('should complain for username length too short', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength-1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.email = '_'.repeat(minimumEmailLength ? minimumEmailLength-1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.password = '_'.repeat(minimumPasswordLength ? minimumPasswordLength-1 : 0);
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'password');
  });

  it('should complain for invalid role value', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.role = 'unknown_role_value';
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'role');
  });

  it('should not complain for USER role value', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.role = UserRole.USER;
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });

  it('should not complain for ADMIN role value', async () => {
    let updateUserDto = buildUpdateUserDto(testCreateUnknownUserDto);
    updateUserDto.role = UserRole.ADMIN;
    const errors = await validate(updateUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });
});

