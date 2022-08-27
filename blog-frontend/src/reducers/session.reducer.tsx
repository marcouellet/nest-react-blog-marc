import { UserDto } from "@blog-common/dtos";

export enum SessionActionType {
  LoggedIn = 'LOGGED_IN',
  LoggingOut = 'LOGGING_OUT',
  Logout = 'LOGOUT',
  SessionExpired = 'SESSION_EXPIRED',
  SessionRefresh = 'SESSION_REFRESH',
  UpdateUser = 'UPDATE_USER'
}

export const createActionLogout = () : SessionAction => { return {type:  SessionActionType.Logout}}
export const createActionLoggingOut = () : SessionAction => { return {type:  SessionActionType.LoggingOut}}
export const createActionLoggedIn = (user: UserDto) : SessionAction => { return {type:  SessionActionType.LoggedIn, user: user}}
export const createActionUpdateUser = (user: UserDto) : SessionAction => { return {type:  SessionActionType.UpdateUser, user: user}}
export const createActionSessionExpired = () : SessionAction => { return {type:  SessionActionType.SessionExpired}}
export const createActionSessionRefresh = () : SessionAction => { return {type:  SessionActionType.SessionRefresh}}

export type SessionAction =
| {
    type: SessionActionType.LoggedIn;
    user: UserDto;
  }
| { type: SessionActionType.Logout }
| { 
    type: SessionActionType.SessionExpired;
  }
| { 
    type: SessionActionType.LoggingOut;
  }
| {
    type: SessionActionType.UpdateUser;
    user: UserDto;
  }
| { 
    type: SessionActionType.SessionRefresh;
  }
;
export interface SessionState {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isSessionExpired: boolean;
  sessionRefresh: boolean;
  user: UserDto | undefined,
}

export const initialSessionState: SessionState = {
  isAuthenticated: false,
  isLoggingOut: false,
  isSessionExpired: false,
  sessionRefresh: false,
  user: undefined,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case SessionActionType.LoggedIn:
    {
      return { ...state, isAuthenticated: true, isSessionExpired: false, sessionRefresh: false, user: action.user! };
    }
    case SessionActionType.Logout: 
    {
      return { ...state, isAuthenticated: false, isSessionExpired: false, isLoggingOut: false, sessionRefresh: false, user: undefined };
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
