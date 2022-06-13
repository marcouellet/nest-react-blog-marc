import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { CreateUserDto, UpdateUserDto, UserDto, IUpdateUserCriterias } from '../../src/core/dtos';
import { testE2ERoleUser, testE2ERoleAdmin, testE2EDummyUserEmail, testE2EAdminUserEmail, testE2EDummyUserPassword, 
    testE2EAdminUserPassword, testE2EDummyUserName, testE2EAdminUserName } from './auth.data';
import { testE2ECreateUnknownUserDto } from '../data/user.data';
import { PostCriterias } from '../../src/core';

const publishedOnDate: Date = new Date();

export const testE2EUnknownUserPostTitle = 'unknown title';
export const testE2EUnknownUserPostUpdatedTitle = 'unknown updated title';

export const testE2EUnknownUserFindPostCriterias: PostCriterias = { title: testE2EUnknownUserPostTitle };
export const testE2EUnknownUserFindUpdatedPostCriterias: PostCriterias = { title: testE2EUnknownUserPostUpdatedTitle };

export const testE2EUnknownUserCreatePostDto: PostDto = {
    title: testE2EUnknownUserPostTitle,
    description: 'description',
    body: 'content of the post',
    user: testE2ECreateUnknownUserDto,
    publishDate: publishedOnDate,
  };

  export const testE2EUnknownUserUpdatePostDto: UpdatePostDto = {
    title: testE2EUnknownUserPostUpdatedTitle,
    description: 'updated description',
    body: 'updated content of the post',
  };
  
  