import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from '../core/dtos';

@Injectable()
export class AuthService {

  getCurrentUser(): string {
    return 'Get Current User successfull!';
  }

  login(loginDto: LoginDto): string {
    return 'Login successfull!';
  }

  register(registerDto: RegisterDto): string {
    return 'Register successfull!';
  }
}
