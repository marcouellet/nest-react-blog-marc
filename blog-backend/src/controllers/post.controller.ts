import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { PostDto, UpdatePostDto } from '../core/dtos';
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
    return this.postService.getPostById(id);
  }

  // Get number of posts owned by user
  @Get('/count/:userId')
  async getNumberOfPostsForUser(@Param('userId') userId: string): Promise<number> {
    return this.postService.getNumberOfPostsForUser(userId);
  }

  // Submit a new post
  @Post('/create')
  @Auth(AllRoles)
  async createPost(@Body(new ValidationPipe()) postDto: PostDto): Promise<PostDto> {
    // Validate userId
    await this.userService.getUserById(postDto.user.id);
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

  // Delete a post
  @Delete('/delete/:id')
  @Auth(AllRoles)
  async deletePost(@Param('id') id: string): Promise<PostDto> {
    return this.postService.deletePost(id);
  }
}
