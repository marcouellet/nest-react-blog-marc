import jwtDecode from 'jwt-decode';
import API from './APIUtils';
import { User } from '../../types';
import TokenService from './TokenService';

type JWTPayload = {
  email: string;
  expiresIn: number;
};

export function isTokenValid(token: string) {
  try {
    const decoded_jwt: JWTPayload = jwtDecode<JWTPayload>(token);
    const current_time = Date.now().valueOf() / 1000;
    return decoded_jwt.expiresIn > current_time;
  } catch (error) {
    return false;
  }
}

function getCurrentUser(): User {
  return TokenService.getUser();
};

async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    API.post<User>('/auth/login', { email, password })
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
    API.post<User>('/auth/register', { username, email, password })
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

const AUTHAPI = {getCurrentUser, login, register, logout}

export default AUTHAPI
