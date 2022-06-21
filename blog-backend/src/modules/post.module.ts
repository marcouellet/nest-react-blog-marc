import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { CryptographerService } from '../services/cryptographer.service';
import { PostFactoryService } from '../services/post/post-factory.service';
import { CategoryFactoryService } from '../services/category/category-factory.service';
@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, CategoryFactoryService, PostService, UserService, CryptographerService],
})
export class PostModule {}
