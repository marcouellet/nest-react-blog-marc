import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useSessionContext } from 'contexts';

import Home from "components/Home";
import ListBlogs from "components/blog/ListBlogs";
import ViewBlog from "components/blog/ViewBlog";
import ListPosts from "components/post/ListPosts";
import ListPostsForUser from "components/post/ListPostsForUser";
import ListCategories from "components/category/ListCategories";
import ViewCategory from "components/category/ViewCategory";
import ViewPost from "components/post/ViewPost";
import ViewPostContent from "components/post/ViewPostContent";
import CreatePost from "components/post/CreatePost";
import UserProfile from "components/user/UserProfile";

import PrivateRoutes from "./PrivateRoutes";
import RestrictedRoutes from "./RestrictedRoutes";
import AdminRoutes from "./AdminRoutes";


export const AppRoutes = () => {

  const { sessionState : { isAuthenticated } } = useSessionContext();
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
      <Route path={"/blog/:postId"} element={<ViewBlog/>}/>
      <Route path={"/user/profile"} element={<UserProfile/>} />
      <Route path={"/post"} element={<ListPosts/>}/>
      <Route path={"/post/user"} element={<ListPostsForUser/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
      <Route path={"/post/content"} element={<ViewPostContent/>} /> 
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
