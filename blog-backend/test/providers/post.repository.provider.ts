import { Post } from '../../src/frameworks/data/mongo/model/post.model';
import { PostRepositoriesMock } from '../mock/data/mongo/model/post.repository.mock';

const PostRepositoryProvider = {
    provide: Post.name,
    useClass: PostRepositoriesMock,
};

export default PostRepositoryProvider;
