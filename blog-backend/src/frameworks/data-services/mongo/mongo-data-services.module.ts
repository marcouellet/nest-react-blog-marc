import { Module, DynamicModule, Inject } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServicesRepositories } from '../../../core';
import {
  Author,
  AuthorSchema,
  Post,
  PostSchema,
} from './model';
import { MongoDataServicesRepositories } from './mongo-data-services-repositories';
import { MONGO_DATA_BASE_SERVER_CONFIGURATION } from '../../../configuration';

@Module({})
export class MongoDataServicesModule {

      static forDataServer() : DynamicModule {
        return {
          module: MongoDataServicesModule,
          imports: [
            MongooseModule.forRoot(MONGO_DATA_BASE_SERVER_CONFIGURATION.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }),
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
        };
      }
}
