import { Module, Global } from '@nestjs/common';
import { IDataRepositories, DataRepositories } from '../../../../src/core/repositories';
import UserRepositoryProvider from '../../../providers/user.repository.provider';
import PostRepositoryProvider from '../../../providers/post.repository.provider';
@Global()
@Module({
  providers: [
    UserRepositoryProvider,
    PostRepositoryProvider,
    {
      provide: IDataRepositories,
      useClass: DataRepositories,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModuleMock {}
