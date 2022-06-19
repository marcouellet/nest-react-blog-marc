import { PostService } from '../../src/services/post/post.service';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { PostFindCriterias } from '../../src/core/find-criterias/post.find-criterias';
import { testPost, testPostCount } from '../data/post.data';

const PostServiceMock = {
    provide: PostService,
    useValue: {
      getAllPosts: jest.fn().mockImplementation(() => Promise.resolve([testPost])),
      getPostById: jest.fn().mockImplementation((id: string) => Promise.resolve(testPost)),
      getNumberOfPostsForUser: jest.fn().mockImplementation((userId: string) => Promise.resolve(testPostCount)),
      findPost: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve(testPost)),
      findManyPosts: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve([testPost])),
      findManyPostsCount: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve(testPostCount)),
      createPost: jest.fn().mockImplementation((postDto: PostDto) => Promise.resolve(testPost)),
      updatePost: jest.fn().mockImplementation((id: string, updatePostDto: UpdatePostDto) => Promise.resolve(testPost)),
      deletePost: jest.fn().mockImplementation((id: string) => Promise.resolve(testPost)),
    },
};

export default PostServiceMock;
