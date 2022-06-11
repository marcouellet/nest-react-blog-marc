import { Post } from '../../src/core/entities/post.entity';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { testUser, testUserDto, testServiceUserDto } from './user.data';

const publishedOnDate: Date = new Date();

export const testPostId = 'abcdefghijkl';
export const testPostCount = 1;
export const testUserPostsCount = 1;

export const testPostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  user: testUserDto,
  publishDate: publishedOnDate,
};

export const testCreatePostDto: PostDto = {
  title: 'title',
  description: 'description',
  body: 'content of the post',
  user: testUserDto,
};

export const testUpdatePostDto: UpdatePostDto = {
  title: 'title',
  description: 'description',
  body: 'content of the post',
};

export const testPost: Post = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  user: testUser,
  publishDate: publishedOnDate,
};

export const testServicePostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  user: testServiceUserDto,
  publishDate: publishedOnDate,
};

export const testFindPostCriterias = { title: 'title' };
