
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { PostServices } from '../services/use-cases/post/post-services.service';
import { CreatePostDto } from '../core/dtos';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('api/post')
export class PostController {

  constructor(private postServices: PostServices) { }

  // Fetch all posts
  @Get()
  async getAll(@Res() res) {
    const posts = await this.postServices.getAllPosts();
    return res.status(HttpStatus.OK).json(posts);
  }
  // Fetch a particular post using ID
  @Get(':id')
  async getPost(@Res() res, @Param('id', new ValidateObjectId()) id) {
    const post = await this.postServices.getPostById(id);
    if (!post) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json(post);
  }

  // Submit a new post
  @Post()
  async createPost(@Res() res, @Body() createPostDto: CreatePostDto) {
    const newPost = await this.postServices.createPost(createPostDto);
    return res.status(HttpStatus.OK).json({
      message: 'Post has been created successfully!',
      post: newPost,
    });
  }

  // Update a post
  @Put('/edit')
  async editPost(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() createPostDto: CreatePostDto,
  ) {
    const editedPost = await this.postServices.updatePost(id, createPostDto);
    if (!editedPost) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been successfully updated',
      post: editedPost,
    });
  }
  // Delete a post using ID
  @Delete('/delete')
  async deletePost(@Res() res, @Query('id', new ValidateObjectId()) id) {
    const deletedPost = await this.postServices.deletePost(id);
    if (!deletedPost) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted!',
      post: deletedPost,
    });
  }
}