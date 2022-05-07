import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../core/entities/user.entity';
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
  async login(@Res() res, @Body() body) {
    this.authService.login(body.user)
      .then((user) => {
        const {id, username, email } = user;
        const data = {id, username, email, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Register user
  @Post('/register')
  async register(@Res() res, @Body() body) {
    this.authService.register(body.user)
      .then((user) => {
        const {id, username, email} = user;
        const data = {id, username, email, token: this.authService.createToken()};
        return res.status(HttpStatus.OK).json(data);
      })
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
