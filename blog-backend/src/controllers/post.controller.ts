import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { PostDto, UpdatePostDto } from '../core/dtos';
import { FilterFindCriterias } from '../core/find-criterias/filter.find-criterias';
import { PostFindCriterias } from '../core/find-criterias/post.find-criterias';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { AllRoles } from '../core/enum/user-role.enum';
@Controller('post')
export class PostController {

  constructor(private readonly postService: PostService, private readonly userService: UserService) { }

  // Fetch all posts
  @Get()
  async getAll(): Promise<PostDto[]> {
    return this.postService.getAllPosts();
  }

  // Fetch a particular post using ID
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostDto> {
    return this.postService.getPost(id);
  }

  // Get number of posts owned by user
  @Get('/count/user/:userId')
  async getNumberOfPostsForUser(@Param('userId') userId: string): Promise<number> {
    return this.postService.getNumberOfPostsForUser(userId);
  }

  // Get number of posts for a category
  @Get('/count/category/:categoryId')
  async getNumberOfPostsForCategory(@Param('categoryId') categoryId: string): Promise<number> {
    return this.postService.getNumberOfPostsForCategory(categoryId);
  }

  // Submit a new post
  @Post('/create')
  @Auth(AllRoles)
  async createPost(@Body(new ValidationPipe()) postDto: PostDto): Promise<PostDto> {
    // Validate userId
    await this.userService.getUser(postDto.user.id);
    // userId match a User
    return this.postService.createPost(postDto);
  }

  // Update a post
  @Put('/update/:id')
  @Auth(AllRoles)
  async updatePost(@Param('id') id: string,
                   @Body(new ValidationPipe()) updatePostDto: UpdatePostDto): Promise<PostDto> {
    return this.postService.updatePost(id, updatePostDto);
  }

  // Fetch a post based on criterias
  @Put('/find')
  async finPost(@Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto> {
    return this.postService.findPost(criterias);
  }

  // Fetch posts based on criterias
  @Put('/findMany')
  async finManyPosts(@Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.postService.findManyPosts(criterias);
  }

  // Fetch posts for a user
  @Put('/findMany/user/:id')
  async finManyPostsForUser(@Param('id') id: string,
                            @Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.postService.findManyPostsForUser(id, criterias);
  }

  // Fetch posts for a category
  @Put('/findMany/category/:id')
  async finManyPostsForCategory(@Param('id') id: string, 
                                @Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.postService.findManyPostsForCategory(id, criterias);
  }

  // Fetch posts without category
  @Put('/findMany/nocategory')
  async finManyPostsWithoutCategory(@Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<PostDto[]> {
    return this.postService.findManyPostsWithoutCategory(criterias);
  }

  // Get count of posts meating criterias 
  @Put('/findManyCount')
  async findManyPostsCount(@Body(new ValidationPipe()) criterias: PostFindCriterias | FilterFindCriterias): Promise<number> {
    return this.postService.findManyPostsCount(criterias);
  }

  // Delete a post
  @Delete('/delete/:id')
  @Auth(AllRoles)
  async deletePost(@Param('id') id: string): Promise<PostDto> {
    return this.postService.deletePost(id);
  }
}
