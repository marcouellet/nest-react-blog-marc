import { Module } from '@nestjs/common';

import { PostController } from 'controllers/post.controller';
import { PostService } from 'services/post/post.service';
import { UserService } from 'services/user/user.service';
import { CryptographerService } from 'services/cryptographer.service';
import { PostFactoryService } from 'services/post/post-factory.service';
import { CategoryFactoryService } from 'services/category/category-factory.service';
import { UserModule } from 'modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, CategoryFactoryService, PostService, UserService, CryptographerService],
})
export class PostModule {}
