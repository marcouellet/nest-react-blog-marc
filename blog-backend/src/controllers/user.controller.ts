import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(@Res() res) {
    this.userService.getAllUsers()
      .then((users) => {res.status(HttpStatus.OK).json(users)})
       .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  @Get(':id')
  async getById(@Res() res, @Param('id', new ValidateObjectId()) id: any) {
    this.userService.getUserById(id)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new user
  @Post('/create')
  async createUser(@Res() res, @Body() userDto: UserDto) {
    this.userService.createUser(userDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Update a user
  @Put('/update/:id')
  async updateUser(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() userDto: UserDto) {
    this.userService.updateUser(userDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Delete user using ID
  @Delete('/delete/:id')
  async deleteUser(@Res() res, @Param('id', new ValidateObjectId()) id) {
    const deletedUser = await this.userService.deleteUser(id)
      .then((user) => res.status(HttpStatus.OK))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
