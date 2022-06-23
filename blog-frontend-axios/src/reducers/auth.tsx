import { User, ICategory } from '../types';

export enum AuthActionType {
  LoadUser = 'LOAD_USER',
  Logout = 'LOGOUT',
  Loading = 'LOADING',
  SessionExpired = 'SESSION_EXPIRED',
  SetCategoryFilter = 'SET_CATEGORY_FILTER',
}
export const createActionLogout = () : AuthAction => { return {type:  AuthActionType.Logout}}
export const createActionLoadUser = (user: User) : AuthAction => { return {type:  AuthActionType.LoadUser, user: user}}
export const createActionLoading = (isLoading: boolean) : AuthAction => { return {type:  AuthActionType.Loading, isLoading: isLoading}}
export const createActionSessionExpired = () : AuthAction => { return {type:  AuthActionType.SessionExpired}}
export const createActionSetCategoryFilter = (category: ICategory) : AuthAction => { return {type:  AuthActionType.SetCategoryFilter, categoryFilter: category}}

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
  | { 
      type: AuthActionType.SetCategoryFilter;
      categoryFilter: ICategory;
    }
;
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  categoryFilter: ICategory | null,
  user: User | null;
}

export const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  isSessionExpired: false,
  categoryFilter: null,
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
    case AuthActionType.SetCategoryFilter: {
      return { ...state, categoryFilter: action.categoryFilter};
    }    default:
      return state;
  }
}
