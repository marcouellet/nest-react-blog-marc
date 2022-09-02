import { Logger } from '@nestjs/common';
import { UserDto, PostDto } from '@Shared/dtos';
import { UserService } from 'services/api/user/user.service';
import { PostService } from 'services/api/post/post.service';
import { UserFindCriterias } from '@Shared/find-criterias';
import { buildCreateUserDto, buildUpdateUserDto } from '@Shared/builders/user.dtos.builders';

export class UserDatabaseBuilder {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      for (const user of users) {
        if (user.email.startsWith('e2e.user.')) {
          Logger.debug(`USER: deleting user with email "${user.email}"`);
          Logger.flush();
          await this.userService.deleteUser(user.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(user => {
            Logger.debug(`USER: user with email "${user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`USER: user with email "${user.email}" deletion failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
     } catch (error) {
      Logger.error('USER: deleteAllE2EUsers failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      for (const post of posts) {
        if (post.user.email.startsWith('e2e.user.')) {
          Logger.debug(`USER: deleting post ${post.title} for user with email "${post.user.email}"`);
          Logger.flush();
          await this.postService.deletePost(post.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(post => {
            Logger.debug(`USER: post ${post.title} for user with email "${post.user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`USER: post ${post.title} deletion for user with email "${post.user.email}" failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
    } catch (error) {
      Logger.error('USER: deleteAllPostsForE2EUsers getAllPosts failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async findUser(userCriterias: UserFindCriterias): Promise<UserDto> {
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
