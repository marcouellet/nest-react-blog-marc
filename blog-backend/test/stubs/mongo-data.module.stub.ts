import { Module, Global } from '@nestjs/common';
import { IDataRepositories, DataRepositories } from '../../src/core/repositories';
import UserRepositoryMock from '../mocks/user.repository.mock';
import PostRepositoryMock from '../mocks/post.repository.mock';
import CategoryRepositoryMock from '../mocks/category.repository.mock';
@Global()
@Module({
  providers: [
    UserRepositoryMock,
    PostRepositoryMock,
    CategoryRepositoryMock,
    {
      provide: IDataRepositories,
      useClass: DataRepositories,
    },
],
  exports: [IDataRepositories],
})
export class MongoDataModuleStub {}
