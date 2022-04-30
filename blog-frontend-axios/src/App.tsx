import * as React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import useAuth, { AuthProvider } from './contexts/auth';

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/dashboard.css";
import { AppRoutes } from "./routes/AppRoutes";

const history = createBrowserHistory();

class App extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <BrowserRouter>
          <Router history={history}>
            <AppRoutes />
          </Router>
          <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
        </BrowserRouter>
      </>
    );
  }
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);


