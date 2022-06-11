import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';
import { testCreateUnknownUserDto } from '../../data/user.data';
import { buildCreateUserDto  } from './builders/user.dtos.builder';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../../../src/core/entities/user.entity';
import { UserRole } from '../../../src/core/enum/user-role.enum';

describe('CreateUserDto Validation', () => {

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      }).compile();
  });

  it('should complain for username length too short', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength-1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.email = '_'.repeat(minimumEmailLength ? minimumEmailLength-1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.password = '_'.repeat(minimumPasswordLength ? minimumPasswordLength-1 : 0);
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'password');
  });

  it('should complain for invalid role value', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.role = 'unknown_role_value';
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'role');
  });

  it('should not complain for USER role value', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.role = UserRole.USER;
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });

  it('should not complain for ADMIN role value', async () => {
    let createUserDto = buildCreateUserDto(testCreateUnknownUserDto);
    createUserDto.role = UserRole.ADMIN;
    const errors = await validate(createUserDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(0);
  });
});

