import { PostDto } from '../../src/core/dtos';
import { PostService } from '../../src/services/post/post.service';
import { PostCriterias } from '../../src/core';
import { buildCreatePostDto, buildUpdatePostDto } from '../../test/validations/dtos/builders/post.dtos.builders';

export class PostDatabaseBuilder {
  constructor(private readonly postService: PostService) {}

  async findPost(postCriterias: PostCriterias): Promise<PostDto> {
    return this.postService.findPost(postCriterias); 
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      posts.forEach(post => {
        try {
          if (post.user.username.startsWith('e2e')) {
            this.postService.deletePost(post.id);
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createPost(createPostData: any): Promise<PostDto> {
    const createPostDto = buildCreatePostDto(createPostData);
    return this.postService.createPost(createPostDto); 
  }

  async updatePost(id: string, updatePostData: any): Promise<PostDto> {
    const updatePostDto = buildUpdatePostDto(updatePostData);
    return this.postService.updatePost(id, updatePostDto); 
  }

  async deletePost(id: string): Promise<PostDto> {
    return this.postService.deletePost(id); 
  }
}