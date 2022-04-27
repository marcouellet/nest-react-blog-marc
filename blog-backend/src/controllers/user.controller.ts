import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get()
  async getAll(@Res() res) {
    const users = await this.userServices.getAllUsers();
    return res.status(HttpStatus.OK).json(users);
  }
 
  @Get(':id')
  async getById(@Res() res, @Param('id', new ValidateObjectId()) id: any) {
    const user = await this.userServices.getUserById(id);
    if (!user) {
        throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json(user);
  }

  // Submit a new user
  @Post('/create')
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    const newUser = await this.userServices.createUser(createUserDto);
    return res.status(HttpStatus.OK).json({
      message: 'User has been created successfully!',
      user: newUser,
    });
  }

  // Update a user
  @Put('/update')
  async updateUser(
    @Res() res,
    @Query('id', new ValidateObjectId()) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userServices.updateUser(id, updateUserDto);
    if (!updatedUser) {
        throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been successfully updated',
      user: updatedUser,
    });
  }
a
  // Delete user using ID
  @Delete('/delete')
  async deleteUser(@Res() res, @Query('id', new ValidateObjectId()) id) {
    const deletedUser = await this.userServices.deleteUser(id);
    if (!deletedUser) {
        throw new NotFoundException('User does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'User has been deleted!',
      user: deletedUser,
    });
  }
}
