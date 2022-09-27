import React, { useReducer, useContext, createContext } from 'react';

import {
  sessionReducer,
  initialSessionState,
  SessionAction,
  SessionState,
} from 'reducers';

type SessionContextProps = {
  sessionState: SessionState;
  dispatchSession: React.Dispatch<SessionAction>;
};

const SessionContext = createContext<SessionContextProps>({
  sessionState: initialSessionState,
  dispatchSession: () => initialSessionState,
});

export function SessionProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = useReducer(sessionReducer, initialSessionState);
  const dispatchSession = (action: SessionAction) => {
    dispatch(action);
  }
  return <SessionContext.Provider value={{ sessionState: state, dispatchSession }} {...props} />;
}

export function useSessionContext() {
  return useContext(SessionContext);
}
