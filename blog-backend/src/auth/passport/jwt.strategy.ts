import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '@Shared/interfaces/jwt.interface';
import { UserDto } from '@Shared/dtos';
import { AuthService } from 'services/api/auth.service';

import { IConfigService } from '../../config/interfaces/config.interface';
import { JWT_STRATEGY_NAME } from '../guards/jwt.guard';
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGY_NAME,
) {
  constructor(private readonly authService: AuthService, private readonly configService: IConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: false,
      secretOrKey: configService.getConfig().authSecretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    try {
      const {sub} = payload;
      return this.authService.validateUser({email: sub});
    } catch (err) {
        throw new UnauthorizedException('Access Denied');
    }
  }
}
