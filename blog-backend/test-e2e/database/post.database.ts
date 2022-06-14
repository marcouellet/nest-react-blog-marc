import { Logger } from '@nestjs/common';
import { UserDto } from '../../src/core/dtos';
import { PostDto } from '../../src/core/dtos';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import { PostCriterias } from '../../src/core';
import { buildCreatePostDto, buildUpdatePostDto } from '../../test/builders/post.dtos.builders';

export class PostDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  async findPost(postCriterias: PostCriterias): Promise<PostDto> {
    return this.postService.findPost(postCriterias); 
  }

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(user => {
        try {
          if (user.email.startsWith('e2e.post.')) {
            this.userService.deleteUser(user.id);
          }
        } catch (error) {
          Logger.error(error);
        }
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      posts.forEach(post => {
        try {
          if (post.user.email.startsWith('e2e.post.')) {
            this.postService.deletePost(post.id);
          }
        } catch (error) {
          Logger.error(error);
        }
      });
    } catch (error) {
      Logger.error(error);
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