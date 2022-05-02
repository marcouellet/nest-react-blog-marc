import React from "react";
import {Navigate, Route } from 'react-router-dom';

const RestrictedRoute = (props:any) => {

  const token = localStorage.getItem('auth');

  console.log("token",token);

  const loggedInRoute = 
  (
    <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
  );
 
  return <>{!token ? <Route {...props} /> : loggedInRoute}</>;

};

export default RestrictedRoute;