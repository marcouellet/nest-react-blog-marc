import API, { TOKEN_KEY , setToken } from './APIUtils';
import { IUser } from '../../types';
import { setLocalStorage } from '../../utils/utils';

type User = {
  user: IUser & { token: string };
};

function handleUserData({ user: { token, ...user } }: User) {
  setLocalStorage(TOKEN_KEY, token);
  setToken(token);
  return user;
}

function getCurrentUser() {
  return API.get<User>('/auth/user');
}

function login(email: string, password: string) {
  return API.post<User>('/auth/login', {
    user: { email, password },
  }).then((response) => handleUserData(response.data));
}

function register(user: {
  username: string;
  email: string;
  password: string;
}) {
  return API.post<User>('/auth/register', { user }).then((response) =>
    handleUserData(response.data),
  );
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  setToken(null);
}

const AUTHAPI = {getCurrentUser, login, register, logout}

export default AUTHAPI
