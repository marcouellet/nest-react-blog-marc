import { User } from '../types';

export enum AuthActionType {
  LoadUser = 'LOAD_USER',
  Logout = 'LOGOUT',
  Loading = 'LOADING',
  SessionExpired = 'SESSION_EXPIRED'
}
export const createActionLogout = () : AuthAction => { return {type:  AuthActionType.Logout}}
export const createActionLoadUser = (user: User) : AuthAction => { return {type:  AuthActionType.LoadUser, user: user}}
export const createActionLoading = (isLoading: boolean) : AuthAction => { return {type:  AuthActionType.Loading, isLoading: isLoading}}
export const createActionSessionExpired = () : AuthAction => { return {type:  AuthActionType.SessionExpired}}

export type AuthAction =
  | {
      type: AuthActionType.LoadUser;
      user: User;
    }
  | { type: AuthActionType.Logout }
  | { 
      type: AuthActionType.Loading;
      isLoading: boolean;
    }
  | { 
      type: AuthActionType.SessionExpired;
    }
;
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  user: User | null;
}

export const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  isSessionExpired: false,
  user: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.LoadUser:
    {
      return { ...state, isAuthenticated: true, isSessionExpired: false, user: action.user! };
    }
    case AuthActionType.Logout: {
      return { ...state, isAuthenticated: false, isSessionExpired: false, user: null };
    }
    case AuthActionType.Loading: {
      return { ...state, isLoading: action.isLoading!};
    }
    case AuthActionType.SessionExpired: {
      return { ...state, isSessionExpired: true};
    }
    default:
      return state;
  }
}
