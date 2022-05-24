import * as React from "react";
import { Route } from "react-router-dom";
import AdminUser from "../components/AdminUser";
import EditUser from "../components/user/EditUser";
import EditPost from "../components/post/EditPost";
import ViewUser from "../components/user/ViewUser";
import CreateUser from "../components/user/CreateUser";
import CreatePost from "../components/post/CreatePost";

const PrivateRoutes = () => {
  return (
    <Route>
      <Route path={"/post/edit/:postId"} element={<EditPost/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
      <Route path={"/user"} element={<AdminUser/>} />
      <Route path={"/user/:userId"} element={<ViewUser/>}/>
      <Route path={"/user/create"} element={<CreateUser/>} />
      <Route path={"/user/edit/:userId"} element={<EditUser/>} />
    </Route>
   );
}

export default PrivateRoutes;
