import { setLocalStorageValue, removeLocalStorageValue, getLocalStorageValue } from '../../utils/utils';
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
  
  const getUserFromToken = (token: IAuthToken) => {
  }

  const getUser = (): User => {
    return getLocalStorageValue(USER_KEY) as User;
  };
  
  const setUser = (user: User) => {
    setLocalStorageValue(USER_KEY, user);
  };
  
  const removeUser = () => {
    removeLocalStorageValue(USER_KEY);
  };
  
  const TokenService = {
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
  };
  
  export default TokenService;