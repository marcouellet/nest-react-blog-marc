import { navigate } from '@reach/router';
import axios, { AxiosResponse } from 'axios';
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

const handleSuccess = (response: AxiosResponse) => {
  //console.log(`API::Succes : ${JSON.stringify(response)}`);
  return response;
}

const handleError = (err: any) => {
  console.log(`API::Error : ${err}`)
  if (!err.response) {
      console.log(`Network error: ${err}`);
  } else {
    if (err.response !== undefined) {
      switch (err.response.status) {
        case 401:
        case 500:
          console.log(`API::Error(401 or 500) : ${err.response.data.Message}`);
          navigate('/register');
          break;
        case 404:
        case 403:
          navigate('/');
          break;
      }
    }
    return Promise.reject(err);
  }
};

// Add a request interceptor
axios.interceptors.request.use(
  config => config,
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  handleSuccess,
  handleError
);

export default axios;
