import HttpApiService from './HttpApiService';
import { IPost, IUpdatePost } from '../../types';
import { buildPostTitleFilter } from './FilterApiService';

const POST_ENDPOINT = `/post`;

class PostApi extends HttpApiService<IPost> {

  getPostById = (id: string) => {
    return super.get(`${POST_ENDPOINT}/${id}`);
  };

  getNumberOfPostsForUser = (userId: string) => {
    return super.getCount(`${POST_ENDPOINT}/count/user/${userId}`);
  };

  getNumberOfPostsForCategory = (categoryId: string) => {
    return super.getCount(`${POST_ENDPOINT}/count/category/${categoryId}`);
  };

  findManyPosts = (postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany`, buildPostTitleFilter(postTitleFilter));
  }

  finManyPostsForUser = (userId: string, postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany/user/${userId}`, buildPostTitleFilter(postTitleFilter));
  };

  findManyPostsForCategory = (categoryId: string, postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany/category/${categoryId}`, buildPostTitleFilter(postTitleFilter));
  };

  findManyPostsWithoutCategory = (postTitleFilter: string) => {
      return super.findMany(`${POST_ENDPOINT}/findMany/nocategory`, buildPostTitleFilter(postTitleFilter));  
  };

  createPost = (data: IPost) => {
    return super.create(`${POST_ENDPOINT}/create`, data);
  };

  updatePost = (id: string, data: IUpdatePost) => {
    return super.update(`${POST_ENDPOINT}/update/${id}`, data);
  };

  deletePost = (id: string) => {
    return super.delete(`${POST_ENDPOINT}/delete/${id}`);
  };
}

export const PostApiService = new PostApi();