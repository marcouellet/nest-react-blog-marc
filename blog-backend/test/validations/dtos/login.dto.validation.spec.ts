import { validate } from '@nestjs/class-validator';
import { testLoginDto } from '../../data/auth.data';
import { buildLoginDto  } from './builders/auth.dtos.builders';
import { minimumEmailLength, minimumPasswordLength } from '../../../src/core/entities/user.entity';

describe('LoginDto Validation', () => {

  it('should complain for email length too short', async () => {
   
    let loginDto = buildLoginDto(testLoginDto);
    loginDto.email = '_'.repeat(minimumEmailLength ? minimumEmailLength-1 : 0);
    const errors = await validate(loginDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'email');
    });

    it('should complain for password length too short', async () => {
   
    let loginDto = buildLoginDto(testLoginDto);
    loginDto.password = '_'.repeat(minimumPasswordLength ? minimumPasswordLength-1 : 0);
    const errors = await validate(loginDto, { skipMissingProperties: true });
    expect(errors.length).toEqual(1);
    const error = errors[0];
        expect(error.property === 'password');
    });
});

