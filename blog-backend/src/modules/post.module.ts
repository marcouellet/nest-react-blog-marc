import { Module } from '@nestjs/common';

import { PostController } from '@Controllers/post.controller';
import { PostService } from 'services/api/post/post.service';
import { UserService } from 'services/api/user/user.service';
import { CryptographerService } from 'services/api/cryptographer.service';
import { PostFactoryService } from 'services/api/post/post-factory.service';
import { CategoryFactoryService } from 'services/api/category/category-factory.service';
import { UserModule } from '@Modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, CategoryFactoryService, PostService, UserService, CryptographerService],
})
export class PostModule {}
