import { User, ICategory } from '../types';

export enum AuthActionType {
  LoadUser = 'LOAD_USER',
  Logout = 'LOGOUT',
  Loading = 'LOADING',
  SessionExpired = 'SESSION_EXPIRED',
  SetCategoryFilter = 'SET_CATEGORY_FILTER',
  SetPostTitleFilter = 'SET_POST_TITLE_FILTER',
  SetUserNameFilter = 'SET_USER_NAME_FILTER',
  UpdateUser = 'UPDATE_USER',
}
export const createActionLogout = () : AuthAction => { return {type:  AuthActionType.Logout}}
export const createActionLoadUser = (user: User) : AuthAction => { return {type:  AuthActionType.LoadUser, user: user}}
export const createActionLoading = (isLoading: boolean) : AuthAction => { return {type:  AuthActionType.Loading, isLoading: isLoading}}
export const createActionSessionExpired = () : AuthAction => { return {type:  AuthActionType.SessionExpired}}
export const createActionSetCategoryFilter = (category: ICategory) : AuthAction => { return {type:  AuthActionType.SetCategoryFilter, categoryFilter: category}}
export const createActionSetPostTitleFilter = (titleFilter: string) : AuthAction => { return {type:  AuthActionType.SetPostTitleFilter, postTitleFilter: titleFilter}}
export const createActionUpdateUser = (user: User) : AuthAction => { return {type:  AuthActionType.UpdateUser, user: user}}
export const createActionSetUserNameFilter = (userName: string) : AuthAction => { return {type:  AuthActionType.SetUserNameFilter, userNameFilter: userName}}

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
  | { 
      type: AuthActionType.SetPostTitleFilter;
      postTitleFilter: string;
    }
  | {
    type: AuthActionType.UpdateUser;
    user: User;
  }
  | { 
    type: AuthActionType.SetUserNameFilter;
    userNameFilter: string;
  }
;;
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  categoryFilter: ICategory | undefined,
  postTitleFilter: string,
  user: User | undefined,
  userNameFilter: string,
}

export const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  isSessionExpired: false,
  categoryFilter: undefined,
  postTitleFilter: '',
  user: undefined,
  userNameFilter: '',
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.LoadUser:
    {
      return { ...state, isAuthenticated: true, isSessionExpired: false, user: action.user! };
    }
    case AuthActionType.Logout: {
      return { ...state, isAuthenticated: false, isSessionExpired: false, user: undefined };
    }
    case AuthActionType.Loading: {
      return { ...state, isLoading: action.isLoading!};
    }
    case AuthActionType.SessionExpired: {
      return { ...state, isSessionExpired: true};
    }
    case AuthActionType.SetCategoryFilter: {
      return { ...state, categoryFilter: action.categoryFilter};
    }
    case AuthActionType.SetPostTitleFilter: {
      return { ...state, postTitleFilter: action.postTitleFilter};
    }    
    case AuthActionType.UpdateUser: {
      return { ...state, user: action.user!};
    }   
    case AuthActionType.SetUserNameFilter: {
      return { ...state, userNameFilter: action.userNameFilter};
    }     
    default:
      return state;
  }
}
