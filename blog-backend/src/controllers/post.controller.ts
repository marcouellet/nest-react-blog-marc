
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { PostServices } from '../services/use-cases/post/post-services.service';
import { CreatePostDto } from '../core/dtos';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('api/post')
export class PostController {

  constructor(private blogService: PostServices) { }

  // Fetch all posts
  @Get()
  async getPosts(@Res() res) {
    const posts = await this.blogService.getAllPosts();
    return res.status(HttpStatus.OK).json(posts);
  }
  // Fetch a particular post using ID
  @Get(':postID')
  async getPost(@Res() res, @Param('postID', new ValidateObjectId()) postID) {
    const post = await this.blogService.getPostById(postID);
    if (!post) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json(post);
  }
  // Submit a post
  @Post()
  async addPost(@Res() res, @Body() createPostDto: CreatePostDto) {
    const newPost = await this.blogService.createPost(createPostDto);
    return res.status(HttpStatus.OK).json({
      message: 'Post has been submitted successfully!',
      post: newPost,
    });
  }


  @Put('/edit')
  async editPost(
    @Res() res,
    @Query('postID', new ValidateObjectId()) postID,
    @Body() createPostDto: CreatePostDto,
  ) {
    const editedPost = await this.blogService.updatePost(postID, createPostDto);
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
  async deletePost(@Res() res, @Query('postID', new ValidateObjectId()) postID) {
    const deletedPost = await this.blogService.deletePost(postID);
    if (!deletedPost) {
        throw new NotFoundException('Post does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted!',
      post: deletedPost,
    });
  }
}