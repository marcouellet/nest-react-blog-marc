import * as React from "react";
import { Route } from "react-router-dom";

import AdminUser from "../components/admin/AdminUser";

import ViewUser from "../components/user/ViewUser";
import CreateUser from "../components/user/CreateUser";
import EditUser from "../components/user/EditUser";
import UserProfile from "../components/user/UserProfile";

import CreateCategory from "../components/category/CreateCategory";
import EditCategory from "../components/category/EditCategory";

import CreatePost from "../components/post/CreatePost";
import EditPost from "../components/post/EditPost";



const PrivateRoutes = () => {
  return (
    <Route>
      <Route path={"/user/profile"} element={<UserProfile/>} />
      <Route path={"/user/:userId"} element={<ViewUser/>}/>
      <Route path={"/user/create"} element={<CreateUser/>} />
      <Route path={"/user/edit/:userId"} element={<EditUser/>} />
      <Route path={"/user"} element={<AdminUser/>} />
      <Route path={"/category/create"} element={<CreateCategory/>} />
      <Route path={"/category/edit/:userId"} element={<EditCategory/>} />
      <Route path={"/post/edit/:postId"} element={<EditPost/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
    </Route>
   );
}

export default PrivateRoutes;
