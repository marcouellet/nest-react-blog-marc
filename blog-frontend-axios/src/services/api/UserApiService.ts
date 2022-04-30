import HttpApiService from "./HttpApiService";
import { API_BASE } from "../../config/api.config";
import { IUser } from "../../models/user";


const CONTACT_ENDPOINT = `${API_BASE}/user`;

export class UserApi extends HttpApiService<IUser> {
  constructor() {
    super(`${API_BASE}`);
  }

  getUserById = (id: number) => {
    return this.get(`${CONTACT_ENDPOINT}/${id}`);
  };

  getAllUsers = () => {
    const response = this.get(`${CONTACT_ENDPOINT}`);
    return response
  };

  createUser = (data: any) => {
    return super.create(`${CONTACT_ENDPOINT}`, data);
  };

  updateUser = (data: IUser) => {
    return super.update(`${CONTACT_ENDPOINT}`, data);
  };
}

export const UserApiService = new UserApi();