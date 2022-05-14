import { Module, UseFilters } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user/user.service';
import { UserFactoryService } from '../services/user/user-factory.service';
import { HttpExceptionFilter } from '../common/http-exception.filter';
@UseFilters(new HttpExceptionFilter())
@Module({
  imports: [UserModule],
  controllers: [UserController, ],
  providers: [UserFactoryService, UserService],
  exports: [UserFactoryService, UserService],
})
export class UserModule {}
