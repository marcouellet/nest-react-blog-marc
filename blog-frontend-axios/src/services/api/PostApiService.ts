import HttpApiService from "./HttpApiService";
import { IPost, IUpdatePost } from "../../types";

const POST_ENDPOINT = `/post`;

class PostApi extends HttpApiService<IPost> {
 
  getPostById = (id: string) => {
    return super.get(`${POST_ENDPOINT}/${id}`);
  };

  getAllPosts = () => {
    return super.getAll(`${POST_ENDPOINT}`);
  };

  getAllPostsForCategory = (categoryId: string) => {
    return super.getAll(`${POST_ENDPOINT}/findMany/category/${categoryId}`);
  };

  getAllPostsForUser = (userId: string) => {
    return super.getAll(`${POST_ENDPOINT}/findMany/user/${userId}`);
  };

  getNumberOfPostsForUser = (userId: string) => {
    return super.getCount(`${POST_ENDPOINT}/count/user/${userId}`);
  };

  getNumberOfPostsForCategory = (categoryId: string) => {
    return super.getCount(`${POST_ENDPOINT}/count/category/${categoryId}`);
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