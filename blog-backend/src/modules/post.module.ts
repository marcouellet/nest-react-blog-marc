import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { CryptographerService } from '../services/cryptographer.service';
import { PostFactoryService } from '../services/post/post-factory.service';
@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, PostService, UserService, CryptographerService],
})
export class PostModule {}
