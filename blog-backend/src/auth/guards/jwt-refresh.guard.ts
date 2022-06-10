import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export const JWT_REFRESH_TOKEN_STRATEGY_NAME = 'jwt-refresh-token';

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard(JWT_REFRESH_TOKEN_STRATEGY_NAME) {
    constructor() {
        super();
    }
}
