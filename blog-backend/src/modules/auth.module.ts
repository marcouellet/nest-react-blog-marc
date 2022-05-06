import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from './user.module';
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService]
})
export class AuthModule {}
