import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { PostCriterias } from '../../src/core';

const publishedOnDate: Date = new Date();

export const testE2ENonExistingPostId_Post= 'twelvelong12'; // required by MongoDB
export const testE2EDummyUserPostTitle_Post = 'dummy title';
export const testE2EDummyUserPostUpdatedTitle_Post = 'dummy updated title';
export const testE2ENonExistingUserPostTitle_Post = 'non existing title'

export const testE2EDummyUserEmail_Post = 'e2e.post.dummy@email.com';
export const testE2EAdminUserEmail_Post = 'e2e.post.admin@email.com';
export const testE2EDummyUserPassword_Post = 'e2e.post.dummy.password';
export const testE2EAdminUserPassword_Post = 'e2e.post.admin.password';
export const testE2EDummyUserName_Post = 'e2e.post.dummy.name';
export const testE2EAdminUserName_Post = 'e2e.post.admin.name';

export const testE2ENonExistingUserFindPostCriterias_Post: PostCriterias = { title: testE2ENonExistingUserPostTitle_Post };
export const testE2EDummyUserFindUpdatedPostCriterias_Post: PostCriterias = { title: testE2EDummyUserPostUpdatedTitle_Post };

export const testE2ERegisterDummyUser_Post = {
  username: testE2EDummyUserName_Post,
  email: testE2EDummyUserEmail_Post,
  password: testE2EDummyUserPassword_Post,
};

export const testE2ERegisterAdminUser_Post = {
  username: testE2EAdminUserName_Post,
  email: testE2EAdminUserEmail_Post,
  password: testE2EAdminUserPassword_Post,
};

export const testE2ELoginDummyUser_Post = {
  email: testE2EDummyUserEmail_Post,
  password: testE2EDummyUserPassword_Post,
};

export const testE2EDummyUserCreatePostDto_Post: PostDto = {
    title: testE2EDummyUserPostTitle_Post,
    description: 'description',
    body: 'content of the post',
    user: undefined,
    publishDate: publishedOnDate,
  };

  export const testE2EDummyUserUpdatePostDto_Post: UpdatePostDto = {
    title: testE2EDummyUserPostUpdatedTitle_Post,
    description: 'updated description',
    body: 'updated content of the post',
  };
  
  