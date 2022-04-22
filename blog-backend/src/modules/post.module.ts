import { Module } from '@nestjs/common';
import { DataServicesModule } from '../frameworks/data-services/data-services.module';
import { PostFactoryService } from '../services/post/post-factory.service';
import { PostService } from '../services/post/post.service';

@Module({
  imports: [DataServicesModule],
  providers: [PostFactoryService, PostService],
  exports: [PostFactoryService, PostService],
})
export class PostModule {}
