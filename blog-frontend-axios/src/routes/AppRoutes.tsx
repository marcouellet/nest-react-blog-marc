import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import ViewPost from "../components/post/ViewPost";
import useAuth from '../contexts/auth';
import PrivateRoutes from "./PrivateRoutes";
import RestrictedRoutes from "./RestrictedRoutes";

export const AppRoutes = () => {

  const { state : { isAuthenticated } } = useAuth()

  return (
    <Routes>
      <Route path={"/"} element={<Home/>} />
      <Route path={"/post/:postId"} element={<ViewPost/>}/>
      {isAuthenticated ?  PrivateRoutes() : RestrictedRoutes()}
      <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
    </Routes>
   );
}
