import { Module, UseFilters } from '@nestjs/common';
import { UserModule } from './user.module';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { PostFactoryService } from '../services/post/post-factory.service';
import { HttpExceptionFilter } from '../common/http-exception.filter';
@UseFilters(new HttpExceptionFilter())
@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, PostService, UserService],
})
export class PostModule {}
