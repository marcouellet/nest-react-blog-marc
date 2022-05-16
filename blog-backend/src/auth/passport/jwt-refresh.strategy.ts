import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserDto } from '../../core/dtos';
import { JWT_REFRESH_TOKEN_STRATEGY_NAME } from '../../auth/interfaces/jwt-refresh.strategy.interface'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('authrefreshtoken'),
      secretOrKey: configService.getConfig().authRefreshTokenSecretKey,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    try {
      return this.authService.findUserByPayload(payload)
    } catch (err) {
        throw new UnauthorizedException('Invalid token');
    }
  }
  // async validate(payload: JwtPayload): Promise<RefreshDto> {
  //   const accessToken = payload.sub;
  //   const authrefreshtoken: IAuthToken = { accessToken }
  //   const refreshDto: RefreshDto = { authrefreshtoken }
  //   return refreshDto;
  // }
 }
