import React from "react";
import {Navigate, Route } from 'react-router-dom';

const PrivateRoute = (props:any) => {

  const token = localStorage.getItem("auth");

  console.log("token", token);

  const nogLoggedInRoute = 
  (
    <Route
        path="*"
        element={<Navigate to="/login" replace />}
    />
  );

  return <>{token ? <Route {...props} /> : nogLoggedInRoute}</>;
};

export default PrivateRoute;
