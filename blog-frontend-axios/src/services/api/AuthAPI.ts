import jwtDecode from 'jwt-decode';
import API from './APIUtils';
import { User, ILogin, IRegister, IRefresh, JWTPayload, IAuthToken } from '../../types';
import TokenService from './TokenService';

export function isTokenValid(token: string) {
  try {
    const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token);
    const current_time = Date.now().valueOf() / 1000;
    return decoded_jwt.exp > current_time;
  } catch (error) {
    return false;
  }
}

function getCurrentUser(): User {
  return TokenService.getUser();
};

async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    const loginParms: ILogin = { email, password }
    API.post<User>('/auth/login', loginParms)
      .then(response => {
        TokenService.setUser(response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function register(username: string, email: string, password: string) : Promise<User> {
  return new Promise((resolve, reject) => {
    const registerParms: IRegister = { username, email, password }
    API.post<User>('/auth/register', registerParms)
      .then(response => {
        TokenService.setUser(response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function refresh(authrefreshtoken: IAuthToken) : Promise<User> {
  return new Promise((resolve, reject) => {
    const refreshParms: IRefresh = { authrefreshtoken };
    API.post<User>('/auth/refresh', refreshParms)
      .then(response => {
        TokenService.setUser(response.data);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function logout() {
  TokenService.removeUser();
}

const AUTHAPI = {getCurrentUser, login, register, refresh, logout}

export default AUTHAPI
