import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserDto } from '@Shared/dtos';
import { AuthService } from 'services/api/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ passReqToCallback: true });
      
    }

    async validate(req: Request, username: string, password: string): Promise<UserDto> {
        try {
            return this.authService.validateUser({username, password});
        } catch (err) {
            throw  new UnauthorizedException('Access Denied');;
        }
     }
}
