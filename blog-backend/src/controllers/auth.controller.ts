import { Controller, Get, Put, Post, Req, Body, UseGuards, Headers, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, UserDto } from '../core/dtos';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import { AllRoles } from '../core/enum/user-role.enum';
import { JwtRefreshTokenAuthGuard } from '../auth/guards/jwt-refresh.guard';
import { JwtPayload } from 'jwt-decode';
import { UserRole } from '../core/enum';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Get current user
  @Get('/whoami')
  @Auth(AllRoles)
  async whoAmI(@Headers('Authorization') auth: string): Promise<JwtPayload> {
    const jwt = auth.replace('Bearer ', '');
    return this.authService.validateToken(jwt);
  }

  // Fetch user profile 
  @Get('/profile')
  @Auth([UserRole.ADMIN, UserRole.USER])
  async getUserProfile(@Headers('Authorization') auth: string): Promise<UserDto> {
    const jwt = auth.replace('Bearer ', ''); 
    return this.authService.getUserFromToken(jwt);
  }  

  // Login user
  @Put('/login')
  async login(@Body(new ValidationPipe()) body: LoginDto): Promise<UserDto> {
    return this.authService.login(body);
  }

  // Register user
  @Post('/register')
  async register(@Body(new ValidationPipe()) body: RegisterDto): Promise<UserDto> {
    return this.authService.register(body);
  }

  // Refresh auth token
  @Put('/refresh')
 @UseGuards(JwtRefreshTokenAuthGuard)
  async refresh(@Req() req: Request): Promise<UserDto> {
    const userDto: UserDto = req.user as UserDto;
    return this.authService.refresh(userDto);
  }
}
