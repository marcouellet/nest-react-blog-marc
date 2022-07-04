import React from "react";
import { Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const RestrictedRoutes = () => {
  return (
    <Route>
      <Route path={"/login"} element={<Login/>} />
      <Route path={"/register"} element={<Register/>} />
    </Route>
   );
}

export default RestrictedRoutes;


