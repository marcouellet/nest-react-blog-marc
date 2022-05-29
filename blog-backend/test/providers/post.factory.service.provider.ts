import { PostFactoryService } from '../../src/services/post/post-factory.service';
import { Post } from '../../src/core/entities';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { testPostDto, testUpdatePostCriterias } from '../data/post.data';

const PostFactoryServiceProvider = {
    provide: PostFactoryService,
    useValue: {
        createPost: jest.fn().mockImplementation((postDto: PostDto) => [testPostDto]),
        createPostDto: jest.fn().mockImplementation((post: Post) => testPostDto),
        createUpdatePostCriterias: jest.fn().mockImplementation((updatePostDto: UpdatePostDto) => testUpdatePostCriterias),
    },
};

export default PostFactoryServiceProvider;
