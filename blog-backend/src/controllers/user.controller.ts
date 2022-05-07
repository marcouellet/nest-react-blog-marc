import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from '../core/dtos';
import { UserService } from '../services/user/user.service';
import { ValidateObjectId } from '../common/pipes/validate-object-id.pipes';
import { User } from '../core/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  private createUserDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.email = user.email;
    userDto.username = user.username;

    return userDto;
  }


  @Get()
  async getAll(@Res() res) {
    this.userServices.getAllUsers()
      .then((users) => {
        const userDtos: UserDto[] = users.map((user) => this.createUserDto(user));
        res.status(HttpStatus.OK).json(userDtos)})
       .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  @Get(':id')
  async getById(@Res() res, @Param('id', new ValidateObjectId()) id: any) {
    this.userServices.getUserById(id)
      .then((user) => res.status(HttpStatus.OK).json(this.createUserDto(user)))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }

  // Submit a new user
  @Post('/create')
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    this.userServices.createUser(createUserDto)
      .then((user) => res.status(HttpStatus.OK).json(this.createUserDto(user)))
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
      .then((user) => res.status(HttpStatus.OK).json(this.createUserDto(user)))
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
