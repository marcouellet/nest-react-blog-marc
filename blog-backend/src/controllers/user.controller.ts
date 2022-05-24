import { Controller, Get, Res, HttpStatus, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { Response } from 'express';
import { UserRole } from 'src/core/enum';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth([UserRole.ADMIN])
  async getAll(@Res() res: Response) {
    this.userService.getAllUsers()
      .then(users => {res.status(HttpStatus.OK).json(users)});
  }

  @Get(':id')
  @Auth([UserRole.ADMIN])
  async getById(@Res() res: Response, @Param('id') id: string) {
    this.userService.getUserById(id)
      .then(user => res.status(HttpStatus.OK).json(user));
  }

  // Submit a new user
  @Post('/create')
  @Auth([UserRole.ADMIN])
  async createUser(@Res() res: Response, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.createUser(userDto)
      .then(user => res.status(HttpStatus.OK).json(user));
  }

  // Update a user
  @Put('/update/:id')
  @Auth([UserRole.ADMIN])
  async updateUser(@Res() res: Response, @Param('id') id: string, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.updateUser(id, userDto)
      .then(user => res.status(HttpStatus.OK).json(user));
  }

  // Delete user using ID
  @Delete('/delete/:id')
  @Auth([UserRole.ADMIN])
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    this.userService.deleteUser(id)
      .then(user => res.status(HttpStatus.OK).json(user));
  }
}
