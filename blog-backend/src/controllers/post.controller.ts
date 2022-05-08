import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { PostDto } from '../core/dtos';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('post')
export class PostController {

  constructor(private postService: PostService, private userService: UserService) { }

  // Fetch all posts
  @Get()
  async getAll(@Res() res) {
    this.postService.getAllPosts()
    .then((posts) => res.status(HttpStatus.OK).json(posts))
    .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Fetch a particular post using ID
  @Get(':id')
  async getPost(@Res() res, @Param('id', new ValidateObjectId()) id) {
    this.postService.getPostById(id)
    .then((post) => res.status(HttpStatus.OK).json(post))
    .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new post
  @Post('/create')
  async createPost(@Res() res, @Body() postDto: PostDto) {
    // Validate userId
    await this.userService.getUserById(postDto.user.id)
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
    // userId match a User
    this.postService.createPost(postDto)
      .then((post) => res.status(HttpStatus.OK).json(post))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Update a post
  @Put('/update')
  async updatePost(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() postDto: PostDto,
  ) {
    this.postService.updatePost(postDto)
      .then((post) => res.status(HttpStatus.OK).json(post))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Delete a post using ID
  @Delete('/delete')
  async deletePost(@Res() res, @Query('id', new ValidateObjectId()) id) {
    this.postService.deletePost(id)
      .then((post) => res.status(HttpStatus.OK))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
