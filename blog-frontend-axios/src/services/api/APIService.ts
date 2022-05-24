import axios from 'axios';
import { API_BASE_URL } from "../../config/api.config";
import { IErrors } from '../../types';
import TokenService from './TokenService';

axios.defaults.baseURL = API_BASE_URL;

export function handleError(error : any) : Promise<IErrors> {
  let errorAttributes : IErrors = {};

  if (error.message && error.message.length > 0) {
    console.log('Error: ', error.message);
    errorAttributes.message = error.message;
  }

  if (error.response) {
    // The client was given an error response (5xx, 4xx)
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    if (error.response.status > 0) {
      errorAttributes.status = error.response.status;
      errorAttributes.statusText = error.request.statusText;
    }
  } else if (error.request) {
    // The client never received a response, and the request was never left
    console.log(error.request);
    if (error.request.status > 0) {
      errorAttributes.status = error.request.status;
      errorAttributes.statusText = error.request.statusText;
    }
  }
   return Promise.reject(errorAttributes);
}

// Add a request interceptor
axios.interceptors.request.use( 
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token.accessToken;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token.accessToken; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return handleError(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return handleError(error);
  },
);

export default axios;
