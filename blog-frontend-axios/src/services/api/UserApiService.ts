import HttpApiService from "./HttpApiService";
import { IUser } from "../../types";

const USER_ENDPOINT = `/user`;
export class UserApi extends HttpApiService<IUser> {

  getUserById = (id: number) => {
    return this.get(`${USER_ENDPOINT}/${id}`);
  };

  getAllUsers = () => {
    const response = this.get(`${USER_ENDPOINT}`);
    return response
  };

  createUser = (data: any) => {
    return super.create(`${USER_ENDPOINT}`, data);
  };

  updateUser = (data: IUser) => {
    return super.update(`${USER_ENDPOINT}`, data);
  };
}

export const UserApiService = new UserApi();