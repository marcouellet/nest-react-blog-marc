import { Module } from '@nestjs/common';
import { PostController } from '../controllers';
import { PostFactoryService, PostService } from '../services';
@Module({
  controllers: [PostController],
  providers: [PostFactoryService, PostService],
  exports: [PostFactoryService, PostService],
})
export class PostModule {}
