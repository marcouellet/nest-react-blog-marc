import API, { TOKEN_KEY , setToken } from './APIUtils';
import { IUser } from '../../types';
import { setLocalStorage } from '../../utils/utils';

type User = {
  user: IUser & { token: string };
};

function handleUserResponse({ user: { token, ...user } }: User) {
  setLocalStorage(TOKEN_KEY, token);
  setToken(token);
  return user;
}

function getCurrentUser() {
  return API.get<User>('/user');
}

function login(email: string, password: string) {
  return API.post<User>('/users/login', {
    user: { email, password },
  }).then((user) => handleUserResponse(user.data));
}

function register(user: {
  username: string;
  email: string;
  password: string;
}) {
  return API.post<User>('/users', { user }).then((user) =>
    handleUserResponse(user.data),
  );
}

function updateUser(user: IUser & Partial<{ password: string }>) {
  return API.put<User>('/user', { user });
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  setToken(null);
}

const AUTHAPI = {getCurrentUser, updateUser, login, register, logout}

export default AUTHAPI
