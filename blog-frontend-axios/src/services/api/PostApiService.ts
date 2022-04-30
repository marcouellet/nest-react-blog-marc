import HttpApiService from "./HttpApiService";
import { IPost } from "../../models/post";

const POST_ENDPOINT = `/post`;

export class PostApi extends HttpApiService<IPost> {
 
  getPostById = (id: number) => {
    return super.get(`${POST_ENDPOINT}/${id}`);
  };

  getAllPosts = () => {
    return super.getAll(`${POST_ENDPOINT}`);
  };

  createPost = (data: any) => {
    return super.create(`${POST_ENDPOINT}`, data);
  };

  updatePost = (data: IPost) => {
    return super.update(`${POST_ENDPOINT}`, data);
  };

  deletePost = (id: number) => {
    return super.delete(`${POST_ENDPOINT}/delete`, id);
  };
}

export const PostApiService = new PostApi();