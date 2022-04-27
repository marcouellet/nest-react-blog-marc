import { Module } from '@nestjs/common';
import { UserFactoryService } from '../services/user/user-factory.service';
import { UserService } from '../services/user/user.service';

@Module({
  providers: [UserFactoryService, UserService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
