import { Module } from '@nestjs/common';
import { CategoryController } from '@Controllers/category.controller';
import { CategoryService } from '@Services/category/category.service';
import { PostService } from '@Services/post/post.service';
import { PostFactoryService } from '@Services/post/post-factory.service';
import { CategoryFactoryService } from '@Services/category/category-factory.service';
import { UserModule } from '@Modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [CategoryController],
  providers: [CategoryFactoryService, CategoryService, PostService, PostFactoryService],
})
export class CategoryModule {}
