import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { REACT_APP_API_BASE_URL, REACT_APP_API_REQUEST_TIMEOUT, 
          REACT_APP_HTTP_RESPONSE_HEADER_TIMESTAMP } from "../../config/api.config";
import { IErrors } from '../../types';
import TokenService from './TokenService';

axios.defaults.baseURL = REACT_APP_API_BASE_URL; // 'http://192.168.99.100:5000/api'; 
axios.defaults.timeout = REACT_APP_API_REQUEST_TIMEOUT;

function processError(error : any) : IErrors {
  let errorAttributes : IErrors = {};

  errorAttributes.baseUrl = axios.defaults.baseURL!;

  console.log('baseURL: ', axios.defaults.baseURL);
  
  if (error.message && error.message.length > 0) {
    console.log('Error: ', error.message);
    errorAttributes.message = error.message;
  }

  if (error.code && error.code === 'ECONNABORTED') {
    errorAttributes.status = StatusCodes.REQUEST_TIMEOUT.toString();
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
    if (error.response.data) {
      errorAttributes.message = error.response.data.message;
    }
    if (error.config.headers) {
      errorAttributes.authorize = error.config.headers['Authorization'] as string;
      errorAttributes.token = [errorAttributes.authorize.replace('Bearer ', '').trim()];
    }
  } else if (error.request) {
    // The client never received a response, and the request was never left
    console.log(error.request);
    if (error.request.status > 0) {
      errorAttributes.status = error.request.status;
      errorAttributes.statusText = error.request.statusText;
    }
  }
   return errorAttributes;
}

export function handleError(error : any) : Promise<IErrors> {
   return Promise.reject(processError(error));
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
    const ts = response.headers[REACT_APP_HTTP_RESPONSE_HEADER_TIMESTAMP];
    const timestamp =Number(ts);
    TokenService.setHttpResponseTimeStamp(timestamp);

    return response;
  },
  (error) => {
    return handleError(error);
  }
);

export default axios;
