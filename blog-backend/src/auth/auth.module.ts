import { Module } from '@nestjs/common';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../modules/user.module';
import { CryptographerService } from '../services/cryptographer.service';

@Module({
  providers: [AuthService, JwtStrategy, LocalStrategy, CryptographerService],
  controllers: [AuthController],
  imports: [UserModule]
})

export class AuthModule { }