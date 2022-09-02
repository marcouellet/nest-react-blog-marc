import * as React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'react-toastify/dist/ReactToastify.css';

import NavigationBar from "components/NavigationBar";
import { SessionProvider, UIProvider, ModalContextProvider, ConfirmationModalContextProvider } from 'contexts';

import { SessionHandler, Processing } from "components/common";

import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <React.StrictMode>
      <ConfirmationModalContextProvider>
        <BrowserRouter>
          <SessionProvider>
            <SessionHandler/>
            <NavigationBar/>
            <ModalContextProvider>
              <UIProvider>
                <Processing/>
                <AppRoutes />
              </UIProvider>
            </ModalContextProvider>
            <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
          </SessionProvider>
        </BrowserRouter>
      </ConfirmationModalContextProvider>
    </React.StrictMode>
  );
}

export default App;


