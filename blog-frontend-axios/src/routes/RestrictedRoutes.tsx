import React from "react";
import useAuth from '../contexts/auth';
import { Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const RestrictedRoutes = () => {

  const { state : { isAuthenticated } } = useAuth();

  if (isAuthenticated) {
    return <></>
  }

  return (
    <Route>
      <Route path={"/login"} element={<Login/>} />
      <Route path={"/register"} element={<Register/>} />
    </Route>
   );
}

export default RestrictedRoutes;


