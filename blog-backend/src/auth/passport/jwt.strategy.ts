import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserDto } from '../../core/dtos';
import { JWT_STRATEGY_NAME } from '../../auth/interfaces/jwt.strategy.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGY_NAME,
) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      secretOrKey: configService.getConfig().authSecretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    try {
      return this.authService.findUserByPayload(payload)
    } catch (err) {
        throw new UnauthorizedException('Invalid token');
    }
  }
}
