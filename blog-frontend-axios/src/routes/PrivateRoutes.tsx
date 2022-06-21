import * as React from "react";
import { Route } from "react-router-dom";

import AdminUser from "../components/admin/AdminUser";
import AdminCategory from "../components/admin/AdminCategory";

import ViewUser from "../components/user/ViewUser";
import CreateUser from "../components/user/CreateUser";
import EditUser from "../components/user/EditUser";

import ViewCategory from "../components/category/ViewCategory";
import CreateCategory from "../components/category/CreateCategory";
import EditCategory from "../components/category/EditCategory";

import CreatePost from "../components/post/CreatePost";
import EditPost from "../components/post/EditPost";



const PrivateRoutes = () => {
  return (
    <Route>
      <Route path={"/post/edit/:postId"} element={<EditPost/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
      <Route path={"/user"} element={<AdminUser/>} />
      <Route path={"/user/:userId"} element={<ViewUser/>}/>
      <Route path={"/user/create"} element={<CreateUser/>} />
      <Route path={"/user/edit/:userId"} element={<EditUser/>} />
      <Route path={"/category"} element={<AdminCategory/>} />
      <Route path={"/category/:categoryId"} element={<ViewCategory/>}/>
      <Route path={"/category/create"} element={<CreateCategory/>} />
      <Route path={"/category/edit/:userId"} element={<EditCategory/>} />
    </Route>
   );
}

export default PrivateRoutes;
