import { Post } from '../../src/core/entities/post.entity';
import { PostDto, UpdatePostDto, IUpdatePostCriterias } from '../../src/core/dtos';
import { testUser, testServiceUser, testUserDto, testServiceUserDto } from './user.data';

const publishedOnDate: Date = new Date();

export const testPostId = 'abcdefghijkl';
export const testPostCount = 1;
export const testServicePostCount = 1;

export const testPostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'body',
  user: testUserDto,
  publishDate: publishedOnDate,
};

export const testCreatePostDto: PostDto = {
  title: 'title',
  description: 'description',
  body: 'body',
  user: testUserDto,
};

export const testUpdatePostDto: UpdatePostDto = {
  title: 'title',
  description: 'description',
  body: 'body',
};

export const testPost: Post = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'body',
  user: testUser,
  publishDate: publishedOnDate,
};

export const testUpdatePostCriterias: IUpdatePostCriterias = {
  title: 'title',
  description: 'description',
  body: 'body',
};

export const testServicePost: Post = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'body',
  user: testServiceUser,
  publishDate: publishedOnDate,
};

export const testServicePostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'body',
  user: testServiceUserDto,
  publishDate: publishedOnDate,
};

export const testFindPostCriterias = { title: 'title' };
