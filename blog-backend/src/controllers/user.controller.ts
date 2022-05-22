import { Controller, Get, Res, HttpStatus, Param, Post, Body, Put, Delete, UseGuards, HttpException } from '@nestjs/common';
import { UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Res() res: Response) {
    this.userService.getAllUsers()
      .then(users => {res.status(HttpStatus.OK).json(users)})
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  @Get(':id')
  async getById(@Res() res: Response, @Param('id') id: string) {
    this.userService.getUserById(id)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Submit a new user
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createUser(@Res() res: Response, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.createUser(userDto)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Update a user
  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Res() res: Response, @Param('id') id: string, @Body(new ValidationPipe()) userDto: UserDto) {
    this.userService.updateUser(id, userDto)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }

  // Delete user using ID
  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Res() res: Response, @Param('id') id: string) {
    this.userService.deleteUser(id)
      .then(user => res.status(HttpStatus.OK).json(user))
      .catch((error: HttpException) => res.status(error.getStatus()).json(error.message));
  }
}
