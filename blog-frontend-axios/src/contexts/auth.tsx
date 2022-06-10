import React from 'react';
import {
  authReducer,
  initialState,
  AuthAction,
  AuthState,
  createActionLoadUser,
  createActionSessionExpired,
} from '../reducers/auth';
import TokenService from '../services/api/TokenService';
import { isTokenValid } from '../services/api/AuthApiService';

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
    const user = TokenService.getUser();

    if (!user) return;

    dispatch(createActionLoadUser(user));

    if (user.authtoken && !isTokenValid(user.authtoken!.accessToken)) {
      dispatch(createActionSessionExpired());
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }} {...props} />;
}

export default function useAuth() {
  return React.useContext(AuthContext);
}
