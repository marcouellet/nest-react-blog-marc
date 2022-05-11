import API, { TOKEN_KEY , setToken } from './APIUtils';
import { User } from '../../types';
import { setLocalStorage } from '../../utils/utils';

function handleToken(token: string) {
  setLocalStorage(TOKEN_KEY, token);
}

async function  getCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    API.get<User>('/auth/user')
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    API.post<User>('/auth/login', { email, password })
      .then(response => {
        handleToken(response.data.token!);
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
        handleToken(response.data.token!);
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  setToken(null);
}

const AUTHAPI = {getCurrentUser, login, register, logout}

export default AUTHAPI
