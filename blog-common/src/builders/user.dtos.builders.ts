import { CreateUserDto, UserDto, UpdateUserDto } from '../dtos';

export function buildCreateUserDto(fields: any ): CreateUserDto {
    const createUsertDto = new CreateUserDto();
    createUsertDto.username = fields.username;
    createUsertDto.email = fields.email;
    createUsertDto.password = fields.password;
    createUsertDto.role = fields.role;
    return createUsertDto;
}

export function buildUpdateUserDto(fields: any ): UpdateUserDto {
  const updateUsertDto = new UpdateUserDto();
  updateUsertDto.username = fields.username;
  updateUsertDto.email = fields.email;
  updateUsertDto.password = fields.password;
  updateUsertDto.role = fields.role;
  return updateUsertDto;
}

export function createUserForUpdate(user: UserDto): UpdateUserDto {
  const updateUser: UpdateUserDto = {username:user.username, email: user.email, password: user.password, 
    role: user.role, image: user.image};
  if (!updateUser.password) {
    delete updateUser.password;
  }
  return updateUser;
}
