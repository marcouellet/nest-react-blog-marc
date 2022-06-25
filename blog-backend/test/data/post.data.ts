import { Post } from '../../src/core/entities/post.entity';
import { PostDto, UpdatePostDto } from '../../src/core/dtos';
import { PostFindCriterias, FilterFindCriterias } from '../../src/core';
import { testUser, testUserDto, testServiceUserDto } from './user.data';

const publishedOnDate: Date = new Date();

export const testPostId = 'abcdefghijkl';
export const testCategoryId = 'mnopqrstuvwz';
export const testPostCount = 1;
export const testUserPostsCount = 1;
export const testCategoryPostsCount = 1;

export const testPostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  category: undefined,
  user: testUserDto,
  image: undefined,
  publishDate: publishedOnDate,
};

export const testCreatePostDto: PostDto = {
  title: 'title',
  description: 'description',
  body: 'content of the post',
  category: undefined,
  image: undefined,
  user: testUserDto,
};

export const testUpdatePostDto: UpdatePostDto = {
  title: 'title',
  description: 'description',
  body: 'content of the post',
  category: undefined,
  image: undefined,
};

export const testPost: Post = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  category: undefined,
  image: undefined,
  user: testUser,
  publishDate: publishedOnDate,
};

export const testServicePostDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  category: undefined,
  image: undefined,
  user: testServiceUserDto,
  publishDate: publishedOnDate,
};

export const testServicePostWithoutCategoryDto: PostDto = {
  id: testPostId,
  title: 'title',
  description: 'description',
  body: 'content of the post',
  image: undefined,
  user: testServiceUserDto,
  publishDate: publishedOnDate,
};

export const testEmptyPostFilterCriterias: PostFindCriterias = {};
export const testWithTitleFindPostCriterias: PostFindCriterias = { title: 'title' };
export const testWithTitleFilterFindCriterias: FilterFindCriterias = { contains: { property:'title', value:'title' }};
