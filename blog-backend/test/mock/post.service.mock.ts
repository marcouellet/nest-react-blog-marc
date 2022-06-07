import { PostService } from '../../src/services/post/post.service';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { PostCriterias } from '../../src/core/find-criterias/post.criterias';
import { testServicePostDto, testServicePostCount } from '../data/post.data';

const PostServiceMock = {
    provide: PostService,
    useValue: {
      getAllPosts: jest.fn().mockImplementation(() => Promise.resolve([testServicePostDto])),
      getPostById: jest.fn().mockImplementation((id: string) => Promise.resolve(testServicePostDto)),
      getNumberOfPostsForUser: jest.fn().mockImplementation((userId: string) => Promise.resolve(1)),
      findPost: jest.fn().mockImplementation((criterias: PostCriterias) => Promise.resolve(testServicePostDto)),
      findManyPosts: jest.fn().mockImplementation((criterias: PostCriterias) => Promise.resolve([testServicePostDto])),
      findManyPostsCount: jest.fn().mockImplementation((criterias: PostCriterias) => Promise.resolve(testServicePostCount)),
      createPost: jest.fn().mockImplementation((postDto: PostDto) => Promise.resolve(testServicePostDto)),
      updatePost: jest.fn().mockImplementation((id: string, updatePostDto: UpdatePostDto) => Promise.resolve(testServicePostDto)),
      deletePost: jest.fn().mockImplementation((id: string) => Promise.resolve(testServicePostDto)),
    },
};

export default PostServiceMock;
