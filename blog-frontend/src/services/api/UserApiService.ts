import { HttpApiService } from "./HttpApiService";
import { FilterService } from './FilterService';
import { UserDto, UpdateUserDto } from "shared/dtos";

const USER_ENDPOINT = `/user`;
class UserApi extends HttpApiService<UserDto> {

  getUserById = (id: string) => {
    return this.get(`${USER_ENDPOINT}/${id}`);
  };

  getAllUsers = () => {
    return super.getAll(`${USER_ENDPOINT}`);
  };

  findManyUsers = (userNameFilter: string) => {
    return super.findMany(`${USER_ENDPOINT}/findMany`, FilterService.buildUserNameFilter(userNameFilter));
  }

  createUser = (data: any) => {
    return super.create(`${USER_ENDPOINT}/create`, data);
  };

  updateUser = (id: string, data: UpdateUserDto) => {
    return super.update(`${USER_ENDPOINT}/update/${id}`, data);
  };

  deleteUser = (id: string) => {
    return super.delete(`${USER_ENDPOINT}/delete/${id}`);
  };
}

export const UserApiService = new UserApi();