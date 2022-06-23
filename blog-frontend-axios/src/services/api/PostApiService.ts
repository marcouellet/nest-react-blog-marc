import HttpApiService from "./HttpApiService";
import { IPost, IUpdatePost } from "../../types";

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
    let filter = postTitleFilter ? {title: postTitleFilter} : {};
    return super.findMany(`${POST_ENDPOINT}/findMany`, filter);
  }

  findManyPostsForCategory = (categoryId: string, postTitleFilter: string) => {
    let filter = postTitleFilter ? {title: postTitleFilter} : {};
    return super.findMany(`${POST_ENDPOINT}/findMany/category/${categoryId}`, filter);
  };

  findManyPostsWithoutCategory = (postTitleFilter: string) => {
    let filter = postTitleFilter ? {title: postTitleFilter} : {};
      return super.findMany(`${POST_ENDPOINT}/findMany/nocategory`, filter);  
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