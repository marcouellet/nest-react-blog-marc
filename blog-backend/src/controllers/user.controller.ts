import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserDto } from '../core/dtos';
import { UserCriterias } from '../core/find-criterias/user.criterias';
import { UserService } from '../services/user/user.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../core/enum';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    // Fetch all users
  @Get()
  @Auth([UserRole.ADMIN])
  async getAll(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }

    // Fetch a particular user using ID
  @Get(':id')
  @Auth([UserRole.ADMIN])
  async getById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUserById(id);
  }

  // Submit a new user
  @Post('/create')
  @Auth([UserRole.ADMIN])
  async createUser(@Body(new ValidationPipe()) userDto: UserDto): Promise<UserDto> {
    return this.userService.createUser(userDto);
  }

  // Fetch a user based on criterias
  @Get('/find')
  async finUser(@Body(new ValidationPipe()) userCriterias: UserCriterias): Promise<UserDto> {
    return this.userService.findUser(userCriterias);
  }

  // Fetch users based on criterias
  @Get('/findAll')
  async finManyUsers(@Body(new ValidationPipe()) userCriterias: UserCriterias): Promise<UserDto[]> {
    return this.userService.findManyUsers(userCriterias);
  }

  // Get count of users meating criterias 
  @Get('/findManyCount')
  async findManyUsersCount(@Body(new ValidationPipe()) userCriterias: UserCriterias): Promise<number> {
    return this.userService.findManyUsersCount(userCriterias);
  }

  // Update a user
  @Put('/update/:id')
  @Auth([UserRole.ADMIN])
  async updateUser(@Param('id') id: string, @Body(new ValidationPipe()) userDto: UserDto): Promise<UserDto> {
    return this.userService.updateUser(id, userDto);
  }

  // Delete user using ID
  @Delete('/delete/:id')
  @Auth([UserRole.ADMIN])
  async deleteUser( @Param('id') id: string): Promise<UserDto> {
    return this.userService.deleteUser(id);
  }
}
