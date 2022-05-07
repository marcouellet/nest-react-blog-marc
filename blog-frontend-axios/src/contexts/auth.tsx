import React from 'react';
import {
  authReducer,
  initialState,
  AuthAction,
  AuthState,
  createActionLogin,
  createActionLogout
} from '../reducers/auth';
import { getLocalStorageValue } from '../utils/utils';
import { TOKEN_KEY, setToken, isTokenValid } from '../services/api/APIUtils';
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
    const token = getLocalStorageValue(TOKEN_KEY);

    if (!token) return;

    if (isTokenValid(token)) {
      setToken(token);
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
