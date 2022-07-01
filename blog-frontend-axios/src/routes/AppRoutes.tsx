import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import ListCategories from "../components/category/ListCategories";
import ViewCategory from "../components/category/ViewCategory";
import ViewPost from "../components/post/ViewPost";
import useAuth from '../contexts/auth';
import PrivateRoutes from "./PrivateRoutes";
import RestrictedRoutes from "./RestrictedRoutes";

export const AppRoutes = () => {

  const { state : { isAuthenticated } } = useAuth();

  return (
    <Routes>
      <Route path={"/"} element={<Home/>} />
      <Route path={"/post/:postId"} element={<ViewPost/>}/>
      <Route path={"/category"} element={<ListCategories/>}/>
      <Route path={"/category/:categoryId"} element={<ViewCategory/>}/>
      {isAuthenticated ?  PrivateRoutes() : RestrictedRoutes()}
      <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
    </Routes>
   );
}
