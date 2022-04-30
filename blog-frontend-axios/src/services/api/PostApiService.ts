import HttpApiService from "./HttpApiService";
import { API_BASE } from "../../config/api.config";
import { IPost } from "../../models/post";


const CONTACT_ENDPOINT = `${API_BASE}/post`;

export class PostApi extends HttpApiService<IPost> {
  constructor() {
    super(`${API_BASE}`);
  }

  getPostById = (id: number) => {
    return super.get(`${CONTACT_ENDPOINT}/${id}`);
  };

  getAllPosts = () => {
    return super.getAll(`${CONTACT_ENDPOINT}`);
  };

  createPost = (data: any) => {
    return super.create(`${CONTACT_ENDPOINT}`, data);
  };

  updatePost = (data: IPost) => {
    return super.update(`${CONTACT_ENDPOINT}`, data);
  };

  deletePost = (id: number) => {
    return super.delete(`${CONTACT_ENDPOINT}/post/delete`, id);
  };
}

export const PostApiService = new PostApi();