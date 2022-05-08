import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { User } from '../core/entities';
@Injectable()
export class AuthService {

  constructor(
    private userService: UserService
  ) {}

  getCurrentUser(): Promise<User> {
    return null;
  }

  createToken(): string {
    return 'token';
  }

  login(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;
    return this.userService.findUser({ email, password });
  }

  register(registerDto: RegisterDto): Promise<UserDto> {
    return this.userService.createUser(registerDto);
  }
}


