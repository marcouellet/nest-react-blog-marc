import React from 'react';

import {
  sessionReducer,
  initialSessionState,
  SessionAction,
  SessionState,
} from '@Reducers';

type SessionContextProps = {
  sessionState: SessionState;
  dispatchSession: React.Dispatch<SessionAction>;
};

const SessionContext = React.createContext<SessionContextProps>({
  sessionState: initialSessionState,
  dispatchSession: () => initialSessionState,
});

export function SessionProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = React.useReducer(sessionReducer, initialSessionState);
  const dispatchSession = (action: SessionAction) => {
    dispatch(action);
  }
  return <SessionContext.Provider value={{ sessionState: state, dispatchSession }} {...props} />;
}

export function useSessionContext() {
  return React.useContext(SessionContext);
}
