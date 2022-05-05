import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user/user.service';
import { UserFactoryService } from '../services/user/user-factory.service';
@Module({
  controllers: [UserController],
  providers: [UserFactoryService, UserService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
