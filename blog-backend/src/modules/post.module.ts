import { Module } from '@nestjs/common';
import { PostFactoryService } from '../services/post/post-factory.service';
import { PostService } from '../services/post/post.service';

@Module({
  providers: [PostFactoryService, PostService],
  exports: [PostFactoryService, PostService],
})
export class PostModule {}
