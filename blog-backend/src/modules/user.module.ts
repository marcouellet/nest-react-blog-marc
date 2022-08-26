import { Module } from '@nestjs/common';
import { UserController } from '@Controllers/user.controller';
import { UserService } from '@Services/user/user.service';
import { CryptographerService } from '@Services/cryptographer.service';
import { UserFactoryService } from '@Services/user/user-factory.service';

@Module({
  controllers: [UserController],
  providers: [UserFactoryService, UserService, CryptographerService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
