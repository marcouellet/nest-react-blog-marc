import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../core/enum';
import { LoginDto } from 'src/core/dtos/login.dto';
import { RegisterDto } from 'src/core/dtos/register.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/user')
  async currentUser(@Res() res) {
    this.authService.getCurrentUser()
      .then((user) => {
        const {username, email} = user;
        const data = {username, email, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Login user
  @Post('/login')
  async login(@Res() res, @Body(new ValidationPipe()) body: LoginDto) {
    this.authService.login(body)
      .then((user) => {
        const {id, username, email, role } = user;
        const data = {id, username, email, role, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Register user
  @Post('/register')
  async register(@Res() res, @Body(new ValidationPipe()) body: RegisterDto) {
    this.authService.register(body)
      .then((user) => {
        const {id, username, email} = user;
        const data = {id, username, email, role: UserRole.USER, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
