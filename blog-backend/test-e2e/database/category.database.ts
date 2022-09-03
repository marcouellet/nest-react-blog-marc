import { Logger } from '@nestjs/common';

import { UserDto, PostDto, CategoryDto } from 'shared/dtos';
import { UserService } from 'services/user/user.service';
import { PostService } from 'services/post/post.service';
import { CategoryService } from 'services/category/category.service';
import { CategoryFindCriterias } from 'shared/find-criterias';
import { buildCreateCategoryDto, buildUpdateCategoryDto } from 'shared/builders/category.dtos.builders';

export class CategoryDatabaseBuilder {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly categoryService: CategoryService) {}

  async findCategory(criterias: CategoryFindCriterias): Promise<CategoryDto> {
    return this.categoryService.findCategory(criterias);
  }

  async deleteAllE2EUsers() {
    try {
      const users: UserDto[] = await this.userService.getAllUsers();

      for (const user of users) {
        if (user.email.startsWith('e2e.category.')) {
          Logger.debug(`CATEGORY: deleting user with email "${user.email}"`);
          Logger.flush();
          await this.userService.deleteUser(user.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(user => {
            Logger.debug(`CATEGORY: user with email "${user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`CATEGORY: user with email "${user.email}" deletion failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
     } catch (error) {
      Logger.error('CATEGORY: deleteAllE2EUsers failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllPostsForE2EUsers() {
    try {
      const posts: PostDto[] = await this.postService.getAllPosts();

      for (const post of posts) {
        if (post.user.email.startsWith('e2e.category.')) {
          Logger.debug(`CATEGORY: deleting post ${post.title} for user with email "${post.user.email}"`);
          Logger.flush();
          await this.postService.deletePost(post.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(post => {
            Logger.debug(`CATEGORY: post ${post.title} for user with email "${post.user.email}" has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`CATEGORY: post ${post.title} deletion for user with email "${post.user.email}" failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
    } catch (error) {
      Logger.error('CATEGORY: deleteAllPostsForE2EUsers getAllPosts failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async deleteAllCategorysForE2EUsers() {
    try {
      const categories: CategoryDto[] = await this.categoryService.getAllCategories();

      for (const category of categories) {
        if (category.title.startsWith('e2e.category.')) {
          Logger.debug(`CATEGORY: deleting category ${category.title}"`);
          Logger.flush();
          await this.categoryService.deleteCategory(category.id)
          // tslint:disable-next-line: no-shadowed-variable
          .then(category => {
            Logger.debug(`CATEGORY: category ${category.title} has been deleted`);
            Logger.flush();
          })
          .catch(error => {
            Logger.error(`CATEGORY: category ${category.title} deletion failed, see following error message:`);
            Logger.error(error);
            Logger.flush();
          });
        }
      }
    } catch (error) {
      Logger.error('CATEGORY: deleteAllCategorysForE2EUsers getAllCategories failed, see following error message:');
      Logger.error(error);
      Logger.flush();
    }
  }

  async createCategory(createCategoryData: any): Promise<CategoryDto> {
    const createCategoryDto = buildCreateCategoryDto(createCategoryData);
    return this.categoryService.createCategory(createCategoryDto);
  }

  async updateCategory(id: string, updateCategoryData: any): Promise<CategoryDto> {
    const updateCategoryDto = buildUpdateCategoryDto(updateCategoryData);
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  async deleteCategory(id: string): Promise<CategoryDto> {
    return this.categoryService.deleteCategory(id);
  }
}
