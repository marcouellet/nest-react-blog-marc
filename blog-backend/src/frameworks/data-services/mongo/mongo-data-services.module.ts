import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServicesRepositories } from '../../../core';
import { DATA_BASE_CONFIGURATION } from '../../../configuration';
import {
  Author,
  AuthorSchema,
  Post,
  PostSchema,
} from './model';
import { MongoDataServicesRepositories } from './mongo-data-services-repositories';

@Module({
  imports: [
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true }),
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: Post.name, schema:PostSchema },
    ]),
  ],
  providers: [
    {
      provide: IDataServicesRepositories,
      useClass: MongoDataServicesRepositories,
    },
  ],
  exports: [IDataServicesRepositories],
})
export class MongoDataServicesModule {}
