import { setLocalStorageValue, removeLocalStorageValue, getLocalStorageValue } from '../../utils/local.storage.utils';
import { REACT_APP_BLOG_MARC_HTTP_RESPONSE_HEADER_TIMESTAMP } from "../../config/api.config";
import { IAuthToken, User } from '../../types';
  
export const USER_KEY = 'user';

  const getLocalAccessToken = (): IAuthToken | null => {
    const user = getLocalStorageValue(USER_KEY) as User;
    return user?.authtoken!;
  };
  
  const updateLocalAccessToken = (token: IAuthToken) => {
    const user = getLocalStorageValue(USER_KEY) as User;
    if (user?.authtoken) {
        user!.authtoken!.accessToken = token.accessToken;
        setLocalStorageValue(USER_KEY, user);
    }
  };
 
  const getUser = (): User => {
    return getLocalStorageValue(USER_KEY) as User;
  };
  
  const setUser = (user: User) => {
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
  
  const TokenService = {
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
    getHttpResponseTimeStamp,
    setHttpResponseTimeStamp
  };
  
  export default TokenService;