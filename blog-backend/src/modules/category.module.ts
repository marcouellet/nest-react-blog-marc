import { Module } from '@nestjs/common';

import { UserModule } from './user.module';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from '../services/category/category.service';
import { PostService } from '../services/post/post.service';
import { PostFactoryService } from '../services/post/post-factory.service';
import { CategoryFactoryService } from '../services/category/category-factory.service';
@Module({
  imports: [UserModule],
  controllers: [CategoryController],
  providers: [CategoryFactoryService, CategoryService, PostService, PostFactoryService],
})
export class CategoryModule {}
