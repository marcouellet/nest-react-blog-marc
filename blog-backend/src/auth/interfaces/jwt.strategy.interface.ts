import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY_NAME) {}
