import React from 'react';
import {
  authReducer,
  initialState,
  AuthAction,
  AuthState,
  createActionLogout,
  createActionLoadUser
} from '../reducers/auth';
import TokenService from '../services/api/TokenService';
import { isTokenValid } from '../services/api/AuthAPI';
import AUTHAPI from '../services/api/AuthAPI';

type AuthContextProps = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

const AuthContext = React.createContext<AuthContextProps>({
  state: initialState,
  dispatch: () => initialState,
});

export function AuthProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  React.useEffect(() => {
    const token = TokenService.getLocalAccessToken();
    const user = TokenService.getUser();

    if (!user) return;

    if (isTokenValid(user.authtoken!.accessToken)) {
      dispatch(createActionLoadUser(user));
    } else {
      dispatch(createActionLogout());
      AUTHAPI.logout();
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }} {...props} />;
}

export default function useAuth() {
  return React.useContext(AuthContext);
}
