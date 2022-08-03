import React from 'react';

import {
  UIReducer,
  initialState,
  UIAction,
  UIState,
} from '../reducers/ui.reducer';

type UIContextProps = {
  uiState: UIState;
  dispatchUI: React.Dispatch<UIAction>;
};

const UIContext = React.createContext<UIContextProps>({
  uiState: initialState,
  dispatchUI: () => initialState,
});

export function UIProvider(props: React.PropsWithChildren<{}>) {
  const [state , dispatch] = React.useReducer(UIReducer, initialState);
  const dispatchUI = (action: UIAction) => {
    dispatch(action);
  }
  return <UIContext.Provider value={{ uiState: state, dispatchUI }} {...props} />;
}

export default function useUIContext() {
  return React.useContext(UIContext);
}
