import { Module, Global, UseFilters } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataRepositories } from '../../../../src/core';
import { User, UserSchema } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post, PostSchema } from '../../../../src/frameworks/data/mongo/model/post.model';
import { ConfigService } from '../../../../src/services/config.service';
import { ConfigModuleMock } from '../../modules/config.module.mock';
import { MongoDataRepositoriesMock } from './mongo-data-repositories.mock';
import { MongoDataExceptionFilterMock } from './mongo-data-exception-filter.mock';
@Global()
@UseFilters(MongoDataExceptionFilterMock)
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
    {
      provide: IDataRepositories,
      useClass: MongoDataRepositoriesMock,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModuleMock {}
