import { Post } from '@blog-common/entities';
import { PostFindCriterias } from '@blog-common/find-criterias/post.find-criterias';

import { testPost, testPostCount } from '../data/post.data';

const PostRepositoryMock = {
    provide: Post.name,
    useValue: {
        convertToGenericEntity: jest.fn().mockImplementation((obj) => obj),
        convertFromGenericEntity: jest.fn().mockImplementation((obj) => obj),
        getAll: jest.fn().mockImplementation(() => Promise.resolve([testPost])),
        get: jest.fn().mockImplementation((id: string) => Promise.resolve(testPost)),
        findOne: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve(testPost)),
        findMany: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve([testPost])),
        findManyForSubDocument: jest.fn().mockImplementation((subDocumentName: string, subDocumentId: string, criterias: {}) => 
        Promise.resolve([testPost])),
        findManyCount: jest.fn().mockImplementation((criterias: PostFindCriterias) => Promise.resolve(testPostCount)),
        findManyCountForSubDocument: jest.fn().mockImplementation((subDocumentName: string, subDocumentId: string) =>
            Promise.resolve(testPostCount)),
          create: jest.fn().mockImplementation((post: Post) => Promise.resolve(testPost)),
        unset: jest.fn().mockImplementation((id: string, unsetParms: {}) => Promise.resolve(undefined)),
        update: jest.fn().mockImplementation((id: string, update: {}, populate?: string) => Promise.resolve(testPost)),
        delete: jest.fn().mockImplementation((id: string, populate?: string) => Promise.resolve(testPost)),
    },
};

export default PostRepositoryMock;
