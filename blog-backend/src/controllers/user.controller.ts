import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Res() res) {
    this.userService.getAllUsers()
      .then((users) => {res.status(HttpStatus.OK).json(users)})
       .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  @Get(':id')
  async getById(@Res() res, @Param('id') id: any) {
    this.userService.getUserById(id)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new user
  @Post('/create')
  async createUser(@Res() res, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.createUser(userDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Update a user
  @Put('/update/:id')
  async updateUser(@Res() res, @Param('id') id, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.updateUser(userDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Delete user using ID
  @Delete('/delete/:id')
  async deleteUser(@Res() res, @Param('id') id) {
    const deletedUser = await this.userService.deleteUser(id)
      .then((user) => res.status(HttpStatus.OK))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
