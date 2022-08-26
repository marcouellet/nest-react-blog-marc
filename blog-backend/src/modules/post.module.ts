import { Module } from '@nestjs/common';

import { PostController } from '@Controllers/post.controller';
import { PostService } from '@Services/post/post.service';
import { UserService } from '@Services/user/user.service';
import { CryptographerService } from '@Services/cryptographer.service';
import { PostFactoryService } from '@Services/post/post-factory.service';
import { CategoryFactoryService } from '@Services/category/category-factory.service';
import { UserModule } from '@Modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostFactoryService, CategoryFactoryService, PostService, UserService, CryptographerService],
})
export class PostModule {}
