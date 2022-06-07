import { Post } from '../../src/frameworks/data/mongo/model/post.model';
import { PostRepositoryStub } from '../stubs/post.repository.stub';

const PostRepositoryStubProvider = {
    provide: Post.name,
    useClass: PostRepositoryStub,
};

export default PostRepositoryStubProvider;
