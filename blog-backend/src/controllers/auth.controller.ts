import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../core/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/user')
  async currentUser(@Res() res) {
    const user = await this.authService.getCurrentUser();
    return res.status(HttpStatus.OK).json(user);
  }

  // Login user
  @Post('/login')
  async login(@Res() res, @Body() loginDto: LoginDto) {
    const newPost = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      message: 'Login successfully!',
    });
  }

  // Register user
  @Post('/register')
  async register(@Res() res, @Body() registerDto: RegisterDto) {
    const newUser = await this.authService.register(registerDto);
    return res.status(HttpStatus.OK).json({
      newUser
    });
  }
}
