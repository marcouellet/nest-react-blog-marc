import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServicesRepositories } from '../../../core';
import {
  Author,
  AuthorSchema,
  Post,
  PostSchema,
} from './model';
import { MongoDataServicesRepositories } from './mongo-data-services-repositories';
import { CONFIG_MODULE_OPTIONS } from '../../../configuration';

@Module({
  imports: [
    MongooseModule.forRoot(CONFIG_MODULE_OPTIONS.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }),
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