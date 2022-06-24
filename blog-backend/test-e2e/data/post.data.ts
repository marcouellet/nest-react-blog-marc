import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { PostFindCriterias, FilterFindCriterias } from '../../src/core';

const publishedOnDate: Date = new Date();

export const testPostCount = 1;
export const testUserPostsCount = 1;
export const testCategoryPostsCount = 1;

export const testE2ENonExistingPostId_Post = 'twelvelong12'; // required by MongoDB
export const testE2ENonExistingCategoryId_Post = 'twelvelong12';
export const testE2EDummyUserPostTitle_Post = 'dummy title';
export const testE2EDummyUserPostUpdatedTitle_Post = 'dummy updated title';
export const testE2ENonExistingUserPostTitle_Post = 'non existing title'
export const testE2EDummyUserEmail_Post = 'e2e.post.dummy@email.com';
export const testE2EAdminUserEmail_Post = 'e2e.post.admin@email.com';
export const testE2EDummyUserPassword_Post = 'e2e.post.dummy.password';
export const testE2EAdminUserPassword_Post = 'e2e.post.admin.password';
export const testE2EDummyUserName_Post = 'e2e.post.dummy.name';
export const testE2EAdminUserName_Post = 'e2e.post.admin.name';

export const testE2ENonExistingUserFindPostCriterias_Post: PostFindCriterias = { title: testE2ENonExistingUserPostTitle_Post };

export const testE2EmptyPostFilterCriterias: PostFindCriterias = {};

export const testE2EWithTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostTitle_Post };
export const testE2EWithPartOfTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostTitle_Post.substring(1,3) };
export const testE2EWithNotPartOfTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostTitle_Post+'extra' };

export const testE2EWithUpdatedTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostUpdatedTitle_Post };
export const testE2EWithPartOfUpdatedTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostUpdatedTitle_Post.substring(1,3) };
export const testE2EWithNotPartOfUpdatedTitleFindPostCriterias: PostFindCriterias = { title: testE2EDummyUserPostUpdatedTitle_Post+'extra' };

export const testWithTitleFilterFindCriterias: FilterFindCriterias = { contains: { property:'title', value:'title' }};


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
    category: undefined,
    user: undefined,
    publishDate: publishedOnDate,
  };

  export const testE2EDummyUserUpdateWithoutCategoryPostDto_Post: UpdatePostDto = {
    category: undefined,
    title: testE2EDummyUserPostUpdatedTitle_Post,
    description: 'updated description',
    body: 'updated content of the post',
  };