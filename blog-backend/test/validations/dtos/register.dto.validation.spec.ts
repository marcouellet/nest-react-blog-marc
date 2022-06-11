import { Test, TestingModule } from '@nestjs/testing';
import { validate } from '@nestjs/class-validator';
import { testRegisterUnknownUserDto } from '../../data/auth.data';
import { buildRegisterDto  } from './builders/auth.dtos.builders';
import { minimumUserNameLength, minimumEmailLength, minimumPasswordLength } from '../../../src/core/entities/user.entity';

describe('RegisterDto Validation', () => {

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      }).compile();
  });

  it('should complain for email length too short', async () => {
    let registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength-1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    let registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.email = '_'.repeat(minimumEmailLength ? minimumEmailLength-1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    let registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.password = '_'.repeat(minimumPasswordLength ? minimumPasswordLength-1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'password');
  });
});

