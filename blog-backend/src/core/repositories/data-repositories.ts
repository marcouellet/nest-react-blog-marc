import { Injectable, Inject } from '@nestjs/common';
import { IDataRepositories, IGenericDataRepository, GenericDataRepository } from './';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class DataRepositories extends IDataRepositories {

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
