import { Logger } from '@nestjs/common';
import { UserDto } from '../../src/core/dtos';
import { PostDto } from '../../src/core/dtos';
import { UserService } from '../../src/services/user/user.service';
import { PostService } from '../../src/services/post/post.service';
import { UserCriterias } from '../../src/core';
import { buildCreateUserDto, buildUpdateUserDto } from '../../test/validations/dtos/builders/user.dtos.builders';

export class UserDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      users.forEach(user => {
        try {
          if (user.email.startsWith('e2e.user.')) {
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
          if (post.user.email.startsWith('e2e.user.')) {
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
