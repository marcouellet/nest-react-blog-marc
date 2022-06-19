import jwtDecode from 'jwt-decode';
import API from './APIService';
import { User, ILogin, IRegister, IRefresh, JWTPayload } from '../../types';
import TokenService from './TokenService';

export function isTokenValid(token: string) {
  try {
    const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token);
    const current_time = Date.now().valueOf() / 1000;
    return decoded_jwt.exp > current_time;
  } catch (_) {
    return false;
  }
}

function getCurrentUser(): User {
  return TokenService.getUser();
};

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

async function refresh(user: User) : Promise<User> {
  const { authtoken, authrefreshtoken } = user;
  const refreshParms: IRefresh = { authtoken, authrefreshtoken };
  return API.put<User>('/auth/refresh', refreshParms)
    .then(response => {
      TokenService.setUser(response.data);
      return response.data;
    });
}

function logout() {
  TokenService.removeUser();
}

const AUTHAPI = {getCurrentUser, login, register, refresh, logout}

export default AUTHAPI
