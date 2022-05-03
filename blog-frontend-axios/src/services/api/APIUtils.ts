import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { API_BASE_URL } from "../../config/api.config";

export const TOKEN_KEY = 'token';

axios.defaults.baseURL = API_BASE_URL;

export function setToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

type JWTPayload = {
  id: string;
  username: string;
  exp: number;
};

export function isTokenValid(token: string) {
  try {
    const decoded_jwt: JWTPayload = jwtDecode(token);
    const current_time = Date.now().valueOf() / 1000;
    return decoded_jwt.exp > current_time;
  } catch (error) {
    return false;
  }
}

// Add a request interceptor
axios.interceptors.request.use(
  config => config,
  error => {
    return Promise.reject(error);
  }
);

export default axios;
