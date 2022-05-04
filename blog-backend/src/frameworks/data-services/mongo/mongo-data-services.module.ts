import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServicesRepositories } from '../../../core';
import { ConfigService } from '../../../services';
import {
  User,
  UserSchema,
  Post,
  PostSchema,
} from './model';
import { MongoDataServicesRepositories } from './mongo-data-services-repositories';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOptions().connectionString,
      }),
      inject: [ConfigService]}),
    MongooseModule.forFeature([
      { name: User.name, schema:UserSchema },
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
