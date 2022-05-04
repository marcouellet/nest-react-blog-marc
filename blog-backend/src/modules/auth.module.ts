import { Module } from '@nestjs/common';
import { AuthController } from '../controllers';
import { ConfigService, AuthService } from '../services';

@Module({
  controllers: [AuthController],
  providers: [ConfigService, AuthService],
})
export class AuthModule {}
