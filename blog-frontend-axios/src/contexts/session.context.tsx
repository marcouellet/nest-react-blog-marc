import React from 'react';

import {
  sessionReducer,
  initialState,
  SessionAction,
  SessionState,
} from '../reducers/session.reducer';

type SessionContextProps = {
  sessionState: SessionState;
  dispatchSession: React.Dispatch<SessionAction>;
};

const SessionContext = React.createContext<SessionContextProps>({
  sessionState: initialState,
  dispatchSession: () => initialState,
});

export function SessionProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = React.useReducer(sessionReducer, initialState);
  const dispatchSession = (action: SessionAction) => {
    dispatch(action);
  }
  return <SessionContext.Provider value={{ sessionState: state, dispatchSession }} {...props} />;
}

export default function useSessionContext() {
  return React.useContext(SessionContext);
}
