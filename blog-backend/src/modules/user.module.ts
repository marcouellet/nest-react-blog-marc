import { Module } from '@nestjs/common';
import { UserController } from '@Controllers/user.controller';
import { UserService } from 'services/api/user/user.service';
import { CryptographerService } from 'services/api/cryptographer.service';
import { UserFactoryService } from 'services/api/user/user-factory.service';

@Module({
  controllers: [UserController],
  providers: [UserFactoryService, UserService, CryptographerService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
