import { CreateUserDto } from '../../src/core/dtos/create-user.dto';
import { UpdateUserDto } from '../../src/core/dtos/update-user.dto';
import { UserCriterias } from '../../src/core/find-criterias';

export function buildFindUserCriterias(fields: any ): UserCriterias {
  const findUserCriterias = new UserCriterias();
  findUserCriterias.username = fields.username;
  findUserCriterias.email = fields.email;
  findUserCriterias.role = fields.role;
  
  return findUserCriterias;
}

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