import { PostService } from '../../src/services/post/post.service';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { testPostDto } from '../data/post.data';

const PostServiceProvider = {
    provide: PostService,
    useValue: {
      getAllPosts: jest.fn().mockImplementation(() => Promise.resolve([testPostDto])),
      getPostById: jest.fn().mockImplementation((id: string) => Promise.resolve(testPostDto)),
      getNumberOfPostsForUser: jest.fn().mockImplementation((userId: string) => Promise.resolve(1)),
      findPost: jest.fn().mockImplementation((criterias: {}) => Promise.resolve(testPostDto)),
      findManyPosts: jest.fn().mockImplementation((criterias: {}) => Promise.resolve([testPostDto])),
      createPost: jest.fn().mockImplementation((postDto: PostDto) => Promise.resolve(testPostDto)),
      updatePost: jest.fn().mockImplementation((id: string, updatePostDto: UpdatePostDto) => Promise.resolve(testPostDto)),
      deletePost: jest.fn().mockImplementation((id: string) => Promise.resolve([testPostDto])),
    },
};

export default PostServiceProvider;
