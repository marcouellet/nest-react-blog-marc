import { Module } from '@nestjs/common';
import { UserController } from '../controllers';
import { UserFactoryService, UserService } from '../services';
@Module({
  controllers: [UserController],
  providers: [UserFactoryService, UserService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
