import * as React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from './contexts/auth';

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/dashboard.css";
import { AppRoutes } from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <Navbar/>
      <BrowserRouter>
          <AppRoutes />
        <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
      </BrowserRouter>
    </>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);


