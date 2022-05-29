import { Post } from '../../src/core/entities/post.entity';
import { PostDto, IUpdatePostCriterias } from '../../src/core/dtos';
import { testUser, testUserDto } from './user.data';

const publishedOnDate: Date = new Date();

export const testPostDto: PostDto = {
  id: '1',
  title: 'title',
  description: 'description',
  body: 'body',
  user: testUserDto,
  publishDate: publishedOnDate,
};

export const testPost: Post = {
  id: '1',
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
