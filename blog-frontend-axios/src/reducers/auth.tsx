import { User, ICategory } from '../types';

export enum AuthActionType {
  LoadUser = 'LOAD_USER',
  LoggingOut = 'LOGGING_OUT',
  Logout = 'LOGOUT',
  Loading = 'LOADING',
  SessionExpired = 'SESSION_EXPIRED',
  SessionRefresh = 'SESSION_REFRESH',
  SetCategoryFilter = 'SET_CATEGORY_FILTER',
  SetPostTitleFilter = 'SET_POST_TITLE_FILTER',
  SetUserNameFilter = 'SET_USER_NAME_FILTER',
  UpdateUser = 'UPDATE_USER',
}
export const createActionLogout = () : AuthAction => { return {type:  AuthActionType.Logout}}
export const createActionLoadUser = (user: User) : AuthAction => { return {type:  AuthActionType.LoadUser, user: user}}
export const createActionLoading = (isLoading: boolean) : AuthAction => { return {type:  AuthActionType.Loading, isLoading: isLoading}}
export const createActionLoggingOut = () : AuthAction => { return {type:  AuthActionType.LoggingOut}}
export const createActionSessionExpired = () : AuthAction => { return {type:  AuthActionType.SessionExpired}}
export const createActionSessionRefresh = () : AuthAction => { return {type:  AuthActionType.SessionRefresh}}
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
      type: AuthActionType.LoggingOut;
    }
  | { 
    type: AuthActionType.SessionRefresh;
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
  isLoggingOut: boolean;
  isSessionExpired: boolean;
  sessionRefresh: boolean;
  categoryFilter: ICategory | undefined,
  postTitleFilter: string,
  user: User | undefined,
  userNameFilter: string,
  lastActivityTimeStamp: Date | undefined;
}

export const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  isLoggingOut: false,
  isSessionExpired: false,
  sessionRefresh: false,
  categoryFilter: undefined,
  postTitleFilter: '',
  user: undefined,
  userNameFilter: '',
  lastActivityTimeStamp: undefined
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.LoadUser:
    {
      return { ...state, isAuthenticated: true, isSessionExpired: false, sessionRefresh: false, user: action.user! };
    }
    case AuthActionType.Logout: {
      return { ...state, isAuthenticated: false, isSessionExpired: false, isLoggingOut: false, sessionRefresh: false, user: undefined };
    }
    case AuthActionType.Loading: {
      return { ...state, isLoading: action.isLoading!, lastActivityTimeStamp: new Date()};
    }
    case AuthActionType.LoggingOut: {
      return { ...state, isLoggingOut: true};
    }
    case AuthActionType.SessionExpired: {
      return { ...state, isSessionExpired: true};
    }
    case AuthActionType.SessionRefresh: {
      return { ...state, sessionRefresh: true};
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
