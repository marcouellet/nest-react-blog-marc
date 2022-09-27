import React, { useReducer, useContext, createContext } from 'react';

import {
  UIReducer,
  initialUIState,
  UIAction,
  UIState,
} from 'reducers';

type UIContextProps = {
  uiState: UIState;
  dispatchUI: React.Dispatch<UIAction>;
};

const UIContext = createContext<UIContextProps>({
  uiState: initialUIState,
  dispatchUI: () => initialUIState,
});

export function UIProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = useReducer(UIReducer, initialUIState);
  const dispatchUI = (action: UIAction) => {
    dispatch(action);
  }
  return <UIContext.Provider value={{ uiState: state, dispatchUI }} {...props} />;
}

export function useUIContext() {
  return useContext(UIContext);
}
