import HttpApiService from "./HttpApiService";
import { IUser, IUpdateUser } from "../../types";

const USER_ENDPOINT = `/user`;
class UserApi extends HttpApiService<IUser> {

  getUserById = (id: string) => {
    return this.get(`${USER_ENDPOINT}/${id}`);
  };

  getAllUsers = () => {
    return super.getAll(`${USER_ENDPOINT}`);
  };

  createUser = (data: any) => {
    return super.create(`${USER_ENDPOINT}/create`, data);
  };

  updateUser = (id: string, data: IUpdateUser) => {
    return super.update(`${USER_ENDPOINT}/update/${id}`, data);
  };

  deleteUser = (id: string) => {
    return super.delete(`${USER_ENDPOINT}/delete/${id}`);
  };
}

export const UserApiService = new UserApi();