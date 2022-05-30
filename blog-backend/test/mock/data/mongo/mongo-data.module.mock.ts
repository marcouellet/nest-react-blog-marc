import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataRepositories } from '../../../../src/core';
import { User, UserSchema } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post, PostSchema } from '../../../../src/frameworks/data/mongo/model/post.model';
import { ConfigService } from '../../../../src/services/config.service';
import { ConfigModuleMock } from '../../modules/config.module.mock';
import { MongoDataRepositoriesMock } from './mongo-data-repositories.mock';
import UserRepositoryProvider from '../../../providers/user.repository.provider';
import PostRepositoryProvider from '../../../providers/post.repository.provider';

@Module({
  imports: [
    ConfigModuleMock,
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
    ConfigService,
    UserRepositoryProvider,
    PostRepositoryProvider,
    {
      provide: IDataRepositories,
      useClass: MongoDataRepositoriesMock,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModuleMock {}
