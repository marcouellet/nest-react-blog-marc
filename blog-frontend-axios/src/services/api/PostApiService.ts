import HttpApiService from "./HttpApiService";
import { IPost } from "../../types";

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

  updatePost = (data: IPost) => {
    return super.update(`${POST_ENDPOINT}/update/${data.id}`, data);
  };

  deletePost = (id: number) => {
    return super.delete(`${POST_ENDPOINT}/delete`, id);
  };
}

export const PostApiService = new PostApi();