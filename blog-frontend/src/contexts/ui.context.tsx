import React from 'react';

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

const UIContext = React.createContext<UIContextProps>({
  uiState: initialUIState,
  dispatchUI: () => initialUIState,
});

export function UIProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = React.useReducer(UIReducer, initialUIState);
  const dispatchUI = (action: UIAction) => {
    dispatch(action);
  }
  return <UIContext.Provider value={{ uiState: state, dispatchUI }} {...props} />;
}

export function useUIContext() {
  return React.useContext(UIContext);
}
