import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get()
  async getAll(@Res() res) {
    this.userServices.getAllUsers()
      .then((users) => res.status(HttpStatus.OK).json(users))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  @Get(':id')
  async getById(@Res() res, @Param('id', new ValidateObjectId()) id: any) {
    this.userServices.getUserById(id)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new user
  @Post('/create')
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    this.userServices.createUser(createUserDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Update a user
  @Put('/update')
  async updateUser(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.userServices.updateUser(id, updateUserDto)
      .then((user) => res.status(HttpStatus.OK).json(user))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Delete user using ID
  @Delete('/delete')
  async deleteUser(@Res() res, @Query('id', new ValidateObjectId()) id) {
    const deletedUser = await this.userServices.deleteUser(id)
      .then((user) => res.status(HttpStatus.OK))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
