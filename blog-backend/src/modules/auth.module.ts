import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'services/api/auth.service';
import { CryptographerService } from 'services/api/cryptographer.service';
import { UserModule } from '@Modules/user.module';
import { AuthController } from '@Controllers/auth.controller';

import { JwtStrategy } from '../auth/passport/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../auth/passport/jwt-refresh.strategy';
import { LocalStrategy } from '../auth/passport/local.strategy';
import { RoleGuard } from '../auth/guards/role.guard';
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
  providers: [AuthService, CryptographerService, JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
