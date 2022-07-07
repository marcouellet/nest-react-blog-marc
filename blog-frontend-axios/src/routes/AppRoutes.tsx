import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import ListBlogs from "../components/blog/ListBlogs";
import ListPosts from "../components/post/ListPosts";
import ListPostsForUser from "../components/post/ListPostsForUser";
import ListCategories from "../components/category/ListCategories";
import ViewCategory from "../components/category/ViewCategory";
import ViewPost from "../components/post/ViewPost";
import CreatePost from "../components/post/CreatePost";
import useAuth from '../contexts/auth';
import PrivateRoutes from "./PrivateRoutes";
import RestrictedRoutes from "./RestrictedRoutes";
import AdminRoutes from "./AdminRoutes";
import UserProfile from "../components/user/UserProfile";

export const AppRoutes = () => {

  const { state : { isAuthenticated } } = useAuth();
  const [controlledRoutes, setControlledRoutes] = useState<JSX.Element>();

  // const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  useEffect(() => {
    setControlledRoutes(isAuthenticated ?  PrivateRoutes() : RestrictedRoutes())
  // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <Routes>
      {controlledRoutes}
      {AdminRoutes()}
      <Route path={"/"} element={<Home/>} />
      <Route path={"/blog"} element={<ListBlogs/>}/>
      <Route path={"/user/profile"} element={<UserProfile/>} />
      <Route path={"/post"} element={<ListPosts/>}/>
      <Route path={"/post/user"} element={<ListPostsForUser/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} /> 
      <Route path={"/post/:postId"} element={<ViewPost/>}/>
      <Route path={"/category"} element={<ListCategories/>}/>
      <Route path={"/category/:categoryId"} element={<ViewCategory/>}/>
      <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
    </Routes>
   );
}
