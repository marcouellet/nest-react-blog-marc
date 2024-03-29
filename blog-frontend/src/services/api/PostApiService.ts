import { HttpApiService } from './HttpApiService';
import { FilterService } from './FilterService';
import { PostDto, UpdatePostDto } from "shared/dtos";

const POST_ENDPOINT = `/post`;
class PostApi extends HttpApiService<PostDto> {

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
    return super.findMany(`${POST_ENDPOINT}/findMany`, FilterService.buildPostTitleFilter(postTitleFilter));
  }

  finManyPostsForUser = (userId: string, postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany/user/${userId}`, FilterService.buildPostTitleFilter(postTitleFilter));
  };

  findManyPostsForCategory = (categoryId: string, postTitleFilter: string) => {
    return super.findMany(`${POST_ENDPOINT}/findMany/category/${categoryId}`, FilterService.buildPostTitleFilter(postTitleFilter));
  };

  findManyPostsWithoutCategory = (postTitleFilter: string) => {
      return super.findMany(`${POST_ENDPOINT}/findMany/nocategory`, FilterService.buildPostTitleFilter(postTitleFilter));  
  };

  createPost = (data: PostDto) => {
    return super.create(`${POST_ENDPOINT}/create`, data);
  };

  updatePost = (id: string, data: UpdatePostDto) => {
    return super.update(`${POST_ENDPOINT}/update/${id}`, data);
  };

  deletePost = (id: string) => {
    return super.delete(`${POST_ENDPOINT}/delete/${id}`);
  };
}

export const PostApiService = new PostApi();