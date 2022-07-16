import React from 'react';
import {
  authReducer,
  initialState,
  AuthAction,
  AuthState,
  createActionSessionExpired,
  createActionLoggingOut,
  createActionLoadUser,
  createActionLoading
} from '../reducers/auth';
import TokenService from '../services/api/TokenService';
import { isTokenValid } from '../utils/session.util';
import { isAutomaticSessionRenewalRequired, getSessionDuration } from '../utils/session.util';
import AuthApiService from '../services/api/AuthApiService';
import { toast } from "react-toastify";

type AuthContextProps = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

const AuthContext = React.createContext<AuthContextProps>({
  state: initialState,
  dispatch: () => initialState,
});

export function AuthProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = React.useReducer(authReducer, initialState);
  
  React.useEffect(() => {
    const user = TokenService.getUser();

    if (!user) return;

    dispatch(createActionLoadUser(user));

    if (user.authtoken) {
      const token = user.authtoken!.accessToken;

      if (isTokenValid(token)) {
        if (isAutomaticSessionRenewalRequired(token)) {
          const sessionDuration = getSessionDuration(token);
          AuthApiService.extendUserSession(sessionDuration)
          .then((user) => {
            dispatch(createActionLoadUser(user));
            // toast.info(`${user.username} session renewed!`);
            })
          .catch(_ => {
            toast.error(`Refresh session failed, logging out!`);
            dispatch(createActionLoggingOut());
          })
          .finally(() => dispatch(createActionLoading(false)));
        }
      } else {
        dispatch(createActionSessionExpired());
      }
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }} {...props} />;
}

export default function useAuth() {
  return React.useContext(AuthContext);
}
