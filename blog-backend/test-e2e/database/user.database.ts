import { Logger } from '@nestjs/common';
import { UserDto } from '../../src/core/dtos';
import { PostDto } from '../../src/core/dtos';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import { UserCriterias } from '../../src/core';
import { buildCreateUserDto, buildUpdateUserDto } from '../../test/builders/user.dtos.builders';

export class UserDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(async user => {
        try {
          if (user.email.startsWith('e2e.user.')) {
            Logger.error(`USER: deleting user ${user.username}`)
            Logger.flush();
            await this.userService.deleteUser(user.id);
          }
        } catch (error) {
          Logger.error('USER: deleteAllE2EUsers delete failed, see following error message:')
          Logger.error(error);
          Logger.flush();
        }
      });
    } catch (error) {
      Logger.error('USER: deleteAllE2EUsers getAllUsers failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      posts.forEach(async post => {
        try {
          if (post.user.email.startsWith('e2e.user.')) {
            Logger.error(`USER: deleting post ${post.title} for user ${post.user.username}`)
            Logger.flush();
            await this.postService.deletePost(post.id);
          }
        } catch (error) {
          Logger.error('USER: deleteAllPostsForE2EUsers deletePost failed, see following error message:')
          Logger.error(error);
          Logger.flush();
        }
      });
    } catch (error) {
      Logger.error('USER: deleteAllPostsForE2EUsers getAllPosts failed, see following error message:')
      Logger.error(error);
      Logger.flush();
    }
  }

  async findUser(userCriterias: UserCriterias): Promise<UserDto> {
    return this.userService.findUser(userCriterias); 
  }

  async createUser(createUserData: any): Promise<UserDto> {
    const createUserDto = buildCreateUserDto(createUserData);
    return this.userService.createUser(createUserDto); 
  }

  async updateUser(id: string, updateUserData: any): Promise<UserDto> {
    const updateUserDto = buildUpdateUserDto(updateUserData);
    return this.userService.updateUser(id, updateUserDto); 
  }

  async deleteUser(id: string): Promise<UserDto> {
    return this.userService.deleteUser(id); 
  }
}
