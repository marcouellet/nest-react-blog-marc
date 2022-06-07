import { Module, Global } from '@nestjs/common';
import { IDataRepositories, DataRepositories } from '../../src/core/repositories';
import UserRepositoryStubProvider from '../providers/user.repository.stub.provider';
import PostRepositoryStubProvider from '../providers/post.repository.stub.provider';
@Global()
@Module({
  providers: [
    UserRepositoryStubProvider,
    PostRepositoryStubProvider,
    {
      provide: IDataRepositories,
      useClass: DataRepositories,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModuleStub {}
