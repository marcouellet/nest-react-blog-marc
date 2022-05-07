import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../core/dtos';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/user')
  async currentUser(@Res() res) {
    this.authService.getCurrentUser()
      .then((user) => res.status(HttpStatus.OK).json({user}))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Login user
  @Post('/login')
  async login(@Res() res, @Body() body) {
    this.authService.login(body.user)
      .then((user) => {
        const {username, email} = user;
        const data = {username, email, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Register user
  @Post('/register')
  async register(@Res() res, @Body() body) {
    this.authService.register(body.user)
      .then((user) => {
        const {username, email} = user;
        const data = {username, email, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
