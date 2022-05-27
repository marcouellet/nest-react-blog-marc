import { Controller, Get, Post, Req, Res, Body, HttpStatus, UseGuards, ForbiddenException} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, RefreshDto } from 'src/core/dtos';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request, Response } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { AllRoles } from "../core/enum/user-role.enum";
import { JwtRefreshTokenAuthGuard } from '../auth/guards/jwt-refresh.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/whoami')
  @Auth(AllRoles)
  async whoAmI(@Req() req: Request, @Res() res: Response) {
    return this.authService.validateToken(req.headers.authorization)
      .then(payload => res.status(HttpStatus.OK).json(payload));
}

  // Login user
  @Post('/login')
  async login(@Req() request: Request, @Res() res: Response, @Body(new ValidationPipe()) body: LoginDto) {
    if (request.user) {
      // User already logged in
      throw new ForbiddenException('User already logged in!');
    }
    return this.authService.login(body)
      .then(user => res.status(HttpStatus.OK).json(user));
  }

  // Register user
  @Post('/register')
  async register(@Res() res: Response, @Body(new ValidationPipe()) body: RegisterDto) {
    this.authService.register(body)
      .then(user => res.status(HttpStatus.OK).json(user));
  }

  // Refresh auth token
  @Post('/refresh')
 @UseGuards(JwtRefreshTokenAuthGuard)
  async refresh(@Res() res: Response, @Body(new ValidationPipe()) body: RefreshDto) {
    this.authService.refresh(body)
      .then(user => res.status(HttpStatus.OK).json(user));
  }
}
