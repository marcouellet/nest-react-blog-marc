import { Module, Global, UseFilters } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataRepositories } from '../../../core';
import { ConfigService } from '../../../services/config.service';
import { User, UserSchema } from './model/user.model';
import { Post, PostSchema } from './model/post.model';
import { MongoDataRepositories } from './mongo-data-repositories';
import { MongoDataExceptionFilter } from './mongo-data-exception-filter';
@Global()
@UseFilters(MongoDataExceptionFilter)
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getConfig().connectionString,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [
    {
      provide: IDataRepositories,
      useClass: MongoDataRepositories,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModule {}
