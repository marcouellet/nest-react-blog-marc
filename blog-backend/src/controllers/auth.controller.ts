import { Controller, Get, Post, Req, Res, Body, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, RefreshDto } from 'src/core/dtos';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/interfaces/jwt.strategy.interface';
import { JwtRefreshTokenAuthGuard } from '../auth/interfaces/jwt-refresh.strategy.interface';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/whoami')
  @UseGuards(JwtAuthGuard)
  async whoAmI(@Req() req: Request, @Res() res: Response) {
    return this.authService.validateToken(req.headers.authorization)
      .then(payload => res.status(HttpStatus.OK).json(payload))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
}

  // Login user
  @Post('/login')
  async login(@Res() res: Response, @Body(new ValidationPipe()) body: LoginDto) {
    return this.authService.login(body)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Register user
  @Post('/register')
  async register(@Res() res: Response, @Body(new ValidationPipe()) body: RegisterDto) {
    this.authService.register(body)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Refresh auth token
  @Post('/refresh')
 @UseGuards(JwtRefreshTokenAuthGuard)
  async refresh(@Res() res: Response, @Body(new ValidationPipe()) body: RefreshDto) {
    this.authService.refresh(body)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));}
}
