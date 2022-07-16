import API from './APIService';
import { User, ILogin, IRegister, IRefresh, ISessionExtension } from '../../types';
import TokenService from './TokenService';

async function login(email: string, password: string): Promise<User> {
  const loginParms: ILogin = { email, password }
  return API.put<User>('/auth/login', loginParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function register(username: string, email: string, password: string) : Promise<User> {
  const registerParms: IRegister = { username, email, password }
  return API.post<User>('/auth/register', registerParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function refresh() : Promise<User> {
  const user = TokenService.getUser();
  const { authtoken, authrefreshtoken } = user;
  const refreshParms: IRefresh = { authtoken, authrefreshtoken };
  return API.put<User>('/auth/session/refresh', refreshParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function extendUserSession(extension: number) : Promise<User> {
  const user = TokenService.getUser();
  const { authtoken, authrefreshtoken } = user;
  const sessionExtensionParms: ISessionExtension = { authtoken, authrefreshtoken, extension };
  return API.put<User>('/auth/session/extend', sessionExtensionParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

async function getUserProfile() : Promise<User> {
  return API.get<User>('/auth/profile')
    .then(response => response.data);
}

async function updateUserProfile(user: User) : Promise<User> {
  return API.put<User>('/auth/profile', user)
    .then(response => response.data);
}

function logout() {
  TokenService.removeUser();
}

const AUTHAPI = {login, register, refresh, logout, getUserProfile, updateUserProfile, extendUserSession}

export default AUTHAPI
