import { CreateUserDto, UserDto, UpdateUserDto } from '../dtos';

export function buildCreateUserDto(fields: any ): CreateUserDto {
    const createUserDto = new CreateUserDto();
    createUserDto.username = fields.username;
    createUserDto.email = fields.email;
    createUserDto.password = fields.password;
    createUserDto.role = fields.role;
    return createUserDto;
}

export function buildUpdateUserDto(fields: any ): UpdateUserDto {
  const updateUserDto = new UpdateUserDto();
  updateUserDto.username = fields.username;
  updateUserDto.email = fields.email;
  updateUserDto.password = fields.password;
  updateUserDto.role = fields.role;
  return updateUserDto;
}

export function createUserForUpdate(user: UserDto): UpdateUserDto {
  const updateUser: UpdateUserDto = {username:user.username, email: user.email, password: user.password, 
    role: user.role, image: user.image};
  if (!updateUser.password) {
    delete updateUser.password;
  }
  return updateUser;
}
