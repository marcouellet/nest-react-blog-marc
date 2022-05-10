import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Post from "../components/post/Post";
import useAuth from '../contexts/auth';
import PrivateRoutes from "./PrivateRoutes";
import RestrictedRoutes from "./RestrictedRoutes";

export const AppRoutes = () => {

  const { state : { isAuthenticated } } = useAuth()

  return (
    <Routes>
      <Route path={"/"} element={<Home/>} />
      <Route path={"/post/:postId"} element={<Post/>}/>
      {isAuthenticated ?  PrivateRoutes() : RestrictedRoutes()}
      <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
    </Routes>
   );
}
