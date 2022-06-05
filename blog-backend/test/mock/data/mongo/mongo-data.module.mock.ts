import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataRepositories } from '../../../../src/core';
import { User, UserSchema } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post, PostSchema } from '../../../../src/frameworks/data/mongo/model/post.model';
import { IConfigService } from '../../../../src/config/interfaces/config.interface';
import { ConfigModule } from '../../../../src/modules/config.module';
import { MongoDataRepositoriesMock } from './mongo-data-repositories.mock';
import UserRepositoryProvider from '../../../providers/user.repository.provider';
import PostRepositoryProvider from '../../../providers/post.repository.provider';
import { GLOBAL_TEST_CONFIG_SERVICE } from '../../../config/config.global';

@Global()
@Module({
  imports: [
    ConfigModule.register(GLOBAL_TEST_CONFIG_SERVICE),
    MongooseModule.forRootAsync({
      useFactory: async (configService: IConfigService) => ({
        uri: configService.getConfig().connectionString,
      }),
      inject: [IConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [
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
