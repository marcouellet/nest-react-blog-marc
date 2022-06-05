import { Module, Global } from '@nestjs/common';
import { JwtStrategy } from '../auth/passport/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../auth/passport/jwt-refresh.strategy';
import { LocalStrategy } from '../auth/passport/local.strategy';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { CryptographerService } from '../services/cryptographer.service';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IConfigService } from '../config/interfaces/config.interface';
import { LOCAL_AUTH_STRATEGY_NAME, JWT_AUTH_STRATEGY_NAME } from '../config/config.constants';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule.registerAsync({
      useFactory: async (configService: IConfigService) => {
        const authStrategyName = configService.getConfig().authStrategyName;
        switch (authStrategyName) {
          case JWT_AUTH_STRATEGY_NAME:
            return {
              defaultStrategy: 'jwt',
              property: 'user',
              session: false,
            };
          case LOCAL_AUTH_STRATEGY_NAME:
            return {
              defaultStrategy: 'local',
              property: 'user',
              session: false,
            };
        }
      },
      inject: [IConfigService],
    }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, IConfigService, CryptographerService, JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
