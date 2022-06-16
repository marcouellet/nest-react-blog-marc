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

      users.forEach(async user => {
        try {
          if (user.email.startsWith('e2e.post.')) {
            Logger.error(`POST: deleting user ${user.username}`)
            Logger.flush();
            await this.userService.deleteUser(user.id);
          }
        } catch (error) {
          Logger.error('POST: deleteAllE2EUsers delete failed, see following error message:')
          Logger.error(error);
          Logger.flush();
        }
      });
    } catch (error) {
      Logger.error('POST: deleteAllE2EUsers getAllUsers failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      posts.forEach(async post => {
        try {
          if (post.user.email.startsWith('e2e.post.')) {
            Logger.error(`POST: deleting post ${post.title} for user ${post.user.username}`)
            Logger.flush();
            await this.postService.deletePost(post.id);
          }
        } catch (error) {
          Logger.error('POST: deleteAllPostsForE2EUsers deletePost failed, see following error message:')
          Logger.error(error);
          Logger.flush();
        }
      });
    } catch (error) {
      Logger.error('POST: deleteAllPostsForE2EUsers getAllPosts failed, see following error message:')
      Logger.error(error);
      Logger.flush();
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