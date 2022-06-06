import { Injectable, Inject } from '@nestjs/common';
import { IDataRepositories, IGenericDataRepository, GenericDataRepository } from '../../../../src/core/repositories';
import { User } from '../../../../src/frameworks/data/mongo/model/user.model';
import { Post } from '../../../../src/frameworks/data/mongo/model/post.model';

@Injectable()
export class MongoDataRepositoriesMock extends IDataRepositories {

  override users: IGenericDataRepository<User>;
  override posts: IGenericDataRepository<Post>;

  constructor(
    @Inject(User.name)
    private readonly UserRepository: IGenericDataRepository<User>,
    @Inject(Post.name)
    private readonly PostRepository: IGenericDataRepository<Post>,
  ) {
    super();
    this.users = new GenericDataRepository<User>(this.UserRepository);
    this.posts = new GenericDataRepository<Post>(this.PostRepository, ['user']);
  }
}
