import { ExtractJwt, Strategy } from 'passport-jwt';
import { IConfigService } from '../../config/interfaces/config.interface';
import { AuthService } from '../../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserDto } from '../../core/dtos';
import { JWT_REFRESH_TOKEN_STRATEGY_NAME } from '../guards/jwt-refresh.guard'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_TOKEN_STRATEGY_NAME,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: IConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getConfig().authSecretKey,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserDto> {
    const body = req.body as any;
    return this.authService.validateRefreshToken(body.authrefreshtoken.accessToken)
      .then(_ => {
        const {sub} = _;
        return this.authService.validateUser({email: sub});
      });
  }
}
