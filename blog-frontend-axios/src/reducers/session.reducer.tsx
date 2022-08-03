import { User } from '../types';

export enum SessionActionType {
  LoadUser = 'LOAD_USER',
  LoggingOut = 'LOGGING_OUT',
  Logout = 'LOGOUT',
  Loading = 'LOADING',
  SessionExpired = 'SESSION_EXPIRED',
  SessionRefresh = 'SESSION_REFRESH',
  UpdateUser = 'UPDATE_USER'
}

export const createActionLogout = () : SessionAction => { return {type:  SessionActionType.Logout}}
export const createActionLoggingOut = () : SessionAction => { return {type:  SessionActionType.LoggingOut}}
export const createActionLoading = (isLoading: boolean) : SessionAction => { return {type:  SessionActionType.Loading, isLoading: isLoading}}
export const createActionLoadUser = (user: User) : SessionAction => { return {type:  SessionActionType.LoadUser, user: user}}
export const createActionSessionExpired = () : SessionAction => { return {type:  SessionActionType.SessionExpired}}
export const createActionSessionRefresh = () : SessionAction => { return {type:  SessionActionType.SessionRefresh}}
export const createActionUpdateUser = (user: User) : SessionAction => { return {type:  SessionActionType.UpdateUser, user: user}}

export type SessionAction =
| {
  type: SessionActionType.LoadUser;
  user: User;
}
| { type: SessionActionType.Logout }
| { 
    type: SessionActionType.Loading;
    isLoading: boolean;
  }
| { 
    type: SessionActionType.SessionExpired;
  }
| { 
    type: SessionActionType.LoggingOut;
  }
| { 
    type: SessionActionType.SessionRefresh;
  }
| {
    type: SessionActionType.UpdateUser;
    user: User;
  }
;
export interface SessionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isSessionExpired: boolean;
  sessionRefresh: boolean;
  user: User | undefined,
  lastActivityTimeStamp: Date | undefined;
}

export const initialState: SessionState = {
  isLoading: false,
  isAuthenticated: false,
  isLoggingOut: false,
  isSessionExpired: false,
  sessionRefresh: false,
  user: undefined,
  lastActivityTimeStamp: undefined
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case SessionActionType.LoadUser:
    {
      return { ...state, isAuthenticated: true, isSessionExpired: false, sessionRefresh: false, user: action.user! };
    }
    case SessionActionType.Logout: 
    {
      return { ...state, isAuthenticated: false, isSessionExpired: false, isLoggingOut: false, sessionRefresh: false, user: undefined };
    }
    case SessionActionType.Loading: {
      return { ...state, isLoading: action.isLoading!, lastActivityTimeStamp: new Date()};
    }
    case SessionActionType.LoggingOut: {
      return { ...state, isLoggingOut: true};
    }
    case SessionActionType.SessionExpired: {
      return { ...state, isSessionExpired: true};
    }
    case SessionActionType.SessionRefresh: {
      return { ...state, sessionRefresh: true};
    } 
    case SessionActionType.UpdateUser: {
      return { ...state, user: action.user!};
    }   
    default:
      return state;
  }
}
