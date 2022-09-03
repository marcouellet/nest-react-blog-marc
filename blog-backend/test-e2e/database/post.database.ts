import { Logger } from '@nestjs/common';

import { UserDto, PostDto } from 'shared/dtos';
import { UserService } from 'services/user/user.service';
import { PostService } from 'services/post/post.service';
import { PostFindCriterias } from 'shared/find-criterias';
import { buildCreatePostDto, buildUpdatePostDto } from 'shared/builders/post.dtos.builders';

export class PostDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  async findPost(postCriterias: PostFindCriterias): Promise<PostDto> {
    return this.postService.findPost(postCriterias);
  }

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      for (const user of users) {
        if (user.email.startsWith('e2e.post.')) {
          Logger.debug(`POST: deleting user with email "${user.email}"`);
          Logger.flush();
          await this.userService.deleteUser(user.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(user => {
            Logger.debug(`POST: user with email "${user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`POST: user with email "${user.email}" deletion failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
     } catch (error) {
      Logger.error('POST: deleteAllE2EUsers failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      for (const post of posts) {
        if (post.user.email.startsWith('e2e.post.')) {
          Logger.debug(`POST: deleting post ${post.title} for user with email "${post.user.email}"`);
          Logger.flush();
          await this.postService.deletePost(post.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(post => {
            Logger.debug(`POST: post ${post.title} for user with email "${post.user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`POST: post ${post.title} deletion for user with email "${post.user.email}" failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
    } catch (error) {
      Logger.error('POST: deleteAllPostsForE2EUsers getAllPosts failed, see following error message:');
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
