import { Controller, Get, Post, Req, Body, UseGuards, ForbiddenException} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, UserDto } from 'src/core/dtos';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { AllRoles } from '../core/enum/user-role.enum';
import { JwtRefreshTokenAuthGuard } from '../auth/guards/jwt-refresh.guard';
import { JwtPayload } from 'jwt-decode';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/whoami')
  @Auth(AllRoles)
  async whoAmI(@Req() req: Request): Promise<JwtPayload> {
    return this.authService.validateToken(req.headers.authorization);
  }

  // Login user
  @Post('/login')
  async login(@Req() request: Request, @Body(new ValidationPipe()) body: LoginDto): Promise<UserDto> {
    if (request.user) {
      // User already logged in
      throw new ForbiddenException('User already logged in!');
    }
    return this.authService.login(body);
  }

  // Register user
  @Post('/register')
  async register(@Body(new ValidationPipe()) body: RegisterDto): Promise<UserDto> {
    return this.authService.register(body);
  }

  // Refresh auth token
  @Post('/refresh')
 @UseGuards(JwtRefreshTokenAuthGuard)
  async refresh(@Req() req: Request): Promise<UserDto> {
    return req.user as UserDto;
  }
}
