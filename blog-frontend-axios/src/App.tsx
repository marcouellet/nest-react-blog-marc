import * as React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'react-toastify/dist/ReactToastify.css';

import NavigationBar from "./components/NavigationBar";
import { SessionProvider } from './contexts/session.context';
import { UIProvider } from './contexts/ui.context';
import { AppRoutes } from "./routes/AppRoutes";
import ModalContextProvider from './contexts/modalContext';
import ConfirmationModalContextProvider from "./contexts/modalConfirmationContext";
import SessionHandler from "./components/common/sessionHandler";
import Processing from './components/common/processing';

const App = () => {
  return (
    <React.StrictMode>
      <ConfirmationModalContextProvider>
        <BrowserRouter>
          <SessionProvider>
            <SessionHandler/>
            <NavigationBar/>
            <Processing/>
            <ModalContextProvider>
              <UIProvider>
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


