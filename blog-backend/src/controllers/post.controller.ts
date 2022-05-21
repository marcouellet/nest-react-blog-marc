import { Controller, Get, Res, HttpStatus, Param, Post, Body, Put, Delete, UseGuards, HttpException } from '@nestjs/common';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { PostDto, UpdatePostDto } from '../core/dtos';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/interfaces/jwt.strategy.interface';
import { Response } from 'express';
@Controller('post')
export class PostController {

  constructor(private readonly postService: PostService, private readonly userService: UserService) { }

  // Fetch all posts
  @Get()
  async getAll(@Res() res: Response) {
    this.postService.getAllPosts()
    .then(posts => res.status(HttpStatus.OK).json(posts))
    .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Fetch a particular post using ID
  @Get(':id')
  async getPost(@Res() res: Response, @Param('id') id: string) {
    this.postService.getPostById(id)
    .then(post => res.status(HttpStatus.OK).json(post))
    .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Submit a new post
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createPost(@Res() res: Response, @Body(new ValidationPipe()) postDto: PostDto) {
    // Validate userId
    await this.userService.getUserById(postDto.user.id);
    // userId match a User
    this.postService.createPost(postDto)
      .then(post => res.status(HttpStatus.OK).json(post))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Update a post
  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  async updatePost(@Res() res: Response, @Param('id') id: string, @Body(new ValidationPipe()) updatePostDto: UpdatePostDto) {
    this.postService.updatePost(id, updatePostDto)
      .then(post => res.status(HttpStatus.OK).json(post))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Delete a post
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  async deletePost(@Res() res: Response, @Param('id') id: string) {
    this.postService.deletePost(id)
      .then(post => res.status(HttpStatus.OK).json(post))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }
}
