import { Global, Module, UseFilters } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IDataRepositories } from 'repositories';
import { IConfigService } from 'config/interfaces/config.interface';
import { User, UserSchema } from './model/user.model';
import { Post, PostSchema } from './model/post.model';
import { Category, CategorySchema } from './model/category.model';
import { MongoDataRepositories } from './mongo-data-repositories';
import { MongoDataExceptionFilter } from './mongo-data-exception-filter';

@UseFilters(MongoDataExceptionFilter)
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: IConfigService) => ({
        uri: configService.getConfig().connectionString,
        useNewUrlParser: true,
      }),
      inject: [IConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [
    {
      provide: IDataRepositories,
      useClass: MongoDataRepositories,
    },
  ] ,
  exports: [IDataRepositories],
})
export class MongoDataModule {}
