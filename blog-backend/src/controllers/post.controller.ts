import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';
import { CreatePostDto, UpdatePostDto, PostDto } from '../core/dtos';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';
import { Post as PostEntity } from '../core/entities/post.entity';

@Controller('post')
export class PostController {

  constructor(private postService: PostService, private userService: UserService) { }

  private createPostDto(post: PostEntity): PostDto {
    const postDto = new PostDto();
    postDto.id = post.id;
    postDto.title = post.title;
    postDto.description = post.description;
    postDto.body = post.body;
    postDto.userId = post.user.id;
    postDto.publishDate = post.publishDate;

    return postDto;
  }

  // Fetch all posts
  @Get()
  async getAll(@Res() res) {
    this.postService.getAllPosts()
    .then((posts) => {
      const postDtos: PostDto[] = posts.map((post) => this.createPostDto(post));
      res.status(HttpStatus.OK).json(postDtos)})
    .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Fetch a particular post using ID
  @Get(':id')
  async getPost(@Res() res, @Param('id', new ValidateObjectId()) id) {
    this.postService.getPostById(id)
    .then((post) => res.status(HttpStatus.OK).json(this.createPostDto(post)))
    .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new post
  @Post('/create')
  async createPost(@Res() res, @Body() createPostDto: CreatePostDto) {
    // Validate userId
    await this.userService.getUserById(createPostDto.userId)
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
    // userId match a User
    this.postService.createPost(createPostDto)
      .then((post) => res.status(HttpStatus.OK).json(this.createPostDto(post)))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Update a post
  @Put('/update')
  async editPost(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    this.postService.updatePost(id, updatePostDto)
      .then((post) => res.status(HttpStatus.OK).json(this.createPostDto(post)))
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
