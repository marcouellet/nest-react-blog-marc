import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto } from '../core/dtos';
import { AuthorService } from '../services/author/author.service';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('api/author')
export class AuthorController {
  constructor(private authorServices: AuthorService) {}

  @Get()
  async getAll(@Res() res) {
    const authors = await this.authorServices.getAllAuthors();
    return res.status(HttpStatus.OK).json(authors);
  }
 
  @Get(':id')
  async getById(@Res() res, @Param('id', new ValidateObjectId()) id: any) {
    const author = await this.authorServices.getAuthorById(id);
    if (!author) {
        throw new NotFoundException('Author does not exist!');
    }
    return res.status(HttpStatus.OK).json(author);
  }

  // Submit a new author
  @Post()
  async createAuthor(@Res() res, @Body() createAuthorDto: CreateAuthorDto) {
    const newAuthor = await this.authorServices.createAuthor(createAuthorDto);
    return res.status(HttpStatus.OK).json({
      message: 'Author has been created successfully!',
      author: newAuthor,
    });
  }

  // Update an author
  @Put('/edit')
  async updateAuthor(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const updatedPost = await this.authorServices.updateAuthor(id, updateAuthorDto);
    if (!updatedPost) {
        throw new NotFoundException('Author does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Author has been successfully updated',
      author: updatedPost,
    });
  }

  // Delete an author using ID
  @Delete('/delete')
  async deletePost(@Res() res, @Query('id', new ValidateObjectId()) id) {
    const deletedAuthor = await this.authorServices.deleteAuthor(id);
    if (!deletedAuthor) {
        throw new NotFoundException('Author does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Author has been deleted!',
      author: deletedAuthor,
    });
  }
}
