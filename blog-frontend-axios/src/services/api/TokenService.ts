import { setLocalStorageValue, removeLocalStorageValue, getLocalStorageValue } from '@Utils';
import { REACT_APP_BLOG_MARC_HTTP_RESPONSE_HEADER_TIMESTAMP } from "../../config/api.config";

import { IAuthToken } from '@blog-common/interfaces';
import { UserDto } from "@blog-common/dtos";
  
export const USER_KEY = 'user';

  const getLocalAccessToken = (): IAuthToken | null => {
    const user = getLocalStorageValue(USER_KEY) as UserDto;
    return user?.authtoken!;
  };
  
  const updateLocalAccessToken = (token: IAuthToken) => {
    const user = getLocalStorageValue(USER_KEY) as UserDto;
    if (user?.authtoken) {
        user!.authtoken!.accessToken = token.accessToken;
        setLocalStorageValue(USER_KEY, user);
    }
  };
 
  const getUser = (): UserDto => {
    return getLocalStorageValue(USER_KEY) as UserDto;
  };
  
  const setUser = (user: UserDto) => {
    setLocalStorageValue(USER_KEY, user);
  };
  
  const removeUser = () => {
    removeLocalStorageValue(USER_KEY);
  };

  const getHttpResponseTimeStamp = (): number => {
    return getLocalStorageValue(REACT_APP_BLOG_MARC_HTTP_RESPONSE_HEADER_TIMESTAMP) as number;
  };
  
  const setHttpResponseTimeStamp = (timestamp: number) => {
    setLocalStorageValue(REACT_APP_BLOG_MARC_HTTP_RESPONSE_HEADER_TIMESTAMP, timestamp);
  };
  
  export const TokenService = {
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    getHttpResponseTimeStamp,
    setHttpResponseTimeStamp
  };
  