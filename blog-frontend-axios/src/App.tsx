import * as React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { AuthProvider } from './contexts/auth';

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { AppRoutes } from "./routes/AppRoutes";
import ConfirmationModalContextProvider from "./contexts/modalConfirmationContext";
import SessionTimeoutHandler from "./components/auth/sessionTimeoutHandler";

const App = () => {
  return (
    <>
      <ConfirmationModalContextProvider>
        <BrowserRouter>
          <SessionTimeoutHandler/>
          <NavigationBar/>
          <AppRoutes />
          <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
        </BrowserRouter>
      </ConfirmationModalContextProvider>
    </>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);


