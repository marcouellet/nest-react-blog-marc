import { validate } from '@nestjs/class-validator';
import { minimumUserEmailLength, minimumUserPasswordLength } from '@Shared/entities/user.entity';
import { buildLoginDto  } from '@Shared/builders/auth.dtos.builders';

import { testLoginDto } from '../../data/auth.data';

describe('LoginDto Validation', () => {

  it('should complain for email length too short', async () => {

    const loginDto = buildLoginDto(testLoginDto);
    loginDto.email = '_'.repeat(minimumUserEmailLength ? minimumUserEmailLength - 1 : 0);
    const errors = await validate(loginDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'email');
    });

  it('should complain for password length too short', async () => {

    const loginDto = buildLoginDto(testLoginDto);
    loginDto.password = '_'.repeat(minimumUserPasswordLength ? minimumUserPasswordLength - 1 : 0);
    const errors = await validate(loginDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
    expect(error.property === 'password');
    });
});
