import { IUser } from '../types';

export enum AuthActionType {
  Login = 'LOGIN',
  LoadUser = 'LOAD_USER',
  Logout = 'LOGOUT',
  Loading = 'LOADING'
}

export const createActionLogin = () : AuthAction => { return {type:  AuthActionType.Login}}
export const createActionLogout = () : AuthAction => { return {type:  AuthActionType.Logout}}
export const createActionLoadUser = (user: IUser) : AuthAction => { return {type:  AuthActionType.LoadUser, user: user}}
export const createActionLoading = (isLoading: boolean) : AuthAction => { return {type:  AuthActionType.Loading, isLoading: isLoading}}

export type AuthAction =
  | {
      type: AuthActionType.Login;
    }
  | {
      type: AuthActionType.LoadUser;
      user: IUser;
    }
  | { type: AuthActionType.Logout }
  | { 
      type: AuthActionType.Loading;
      isLoading: boolean;
    }
;
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
}

export const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.Login: {
      return { ...state, isAuthenticated: true };
    }
    case AuthActionType.LoadUser: {
      return { ...state, user: action.user!};
    }
    case AuthActionType.Logout: {
      return { ...state, isAuthenticated: false, user: null };
    }
    case AuthActionType.Loading: {
      return { ...state, isLoading: action.isLoading!};
    }
    default:
      return state;
  }
}
