import HttpApiService from "./HttpApiService";
import { IPost, IUpdatePost } from "../../types";

const POST_ENDPOINT = `/post`;

class PostApi extends HttpApiService<IPost> {
 
  private buildPostTitleFilter(postTitleFilter: string) : any {
    let filter: any = {};
    if (postTitleFilter) {
       filter.title = { "$regex": postTitleFilter, "$options": "i" }
    }
    return filter;
  }

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
    return super.findMany(`${POST_ENDPOINT}/findMany`, this.buildPostTitleFilter(postTitleFilter));
  }

  findManyPostsForCategory = (categoryId: string, postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany/category/${categoryId}`, this.buildPostTitleFilter(postTitleFilter));
  };

  findManyPostsWithoutCategory = (postTitleFilter: string) => {
      return super.findMany(`${POST_ENDPOINT}/findMany/nocategory`, this.buildPostTitleFilter(postTitleFilter));  
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