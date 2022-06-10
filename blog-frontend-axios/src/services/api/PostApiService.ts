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

  getNumberOfPostsForUser = (userId: string) => {
    return super.getCount(`${POST_ENDPOINT}/count/${userId}`);
  };

  createPost = (data: any) => {
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