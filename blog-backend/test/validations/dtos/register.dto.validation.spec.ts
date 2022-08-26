import { validate } from '@nestjs/class-validator';
import { minimumUserNameLength, minimumUserEmailLength, minimumUserPasswordLength } from '@blog-common/entities/user.entity';
import { buildRegisterDto  } from '@blog-common/builders/auth.dtos.builders';

import { testRegisterUnknownUserDto } from '../../data/auth.data';

describe('RegisterDto Validation', () => {

  it('should complain for email length too short', async () => {
    const registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.username = '_'.repeat(minimumUserNameLength ? minimumUserNameLength - 1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'username');
  });

  it('should complain for email length too short', async () => {
    const registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.email = '_'.repeat(minimumUserEmailLength ? minimumUserEmailLength - 1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'email');
  });

  it('should complain for password length too short', async () => {
    const registerDto = buildRegisterDto(testRegisterUnknownUserDto);
    registerDto.password = '_'.repeat(minimumUserPasswordLength ? minimumUserPasswordLength - 1 : 0);
    const errors = await validate(registerDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'password');
  });
});
