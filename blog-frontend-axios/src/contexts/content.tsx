import React from 'react';

type ContentContextProps = {
  content: any;
};

const ContentContext = React.createContext<ContentContextProps>({
    content: undefined,
});

export function ContentContextProvider(props: React.PropsWithChildren<ContentContextProps>) {

  return <ContentContext.Provider value={props.content} {...props} />;
}

export default function useContent() {
  return React.useContext(ContentContext);
}
