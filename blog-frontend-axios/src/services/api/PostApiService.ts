import HttpApiService from "./HttpApiService";
import { IPost, IUpdatePost } from "../../types";

const POST_ENDPOINT = `/post`;

export class PostApi extends HttpApiService<IPost> {
 
  getPostById = (id: string) => {
    return super.get(`${POST_ENDPOINT}/${id}`);
;
  };

  getAllPosts = () => {
    return super.getAll(`${POST_ENDPOINT}`);
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