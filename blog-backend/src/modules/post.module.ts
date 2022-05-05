import { Module } from '@nestjs/common';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post/post.service';
import { PostFactoryService } from '../services/post/post-factory.service';
@Module({
  controllers: [PostController],
  providers: [PostFactoryService, PostService],
  exports: [PostFactoryService, PostService],
})
export class PostModule {}
