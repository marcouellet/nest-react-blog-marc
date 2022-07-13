import * as React from "react";
import { Route } from "react-router-dom";

import useAuth from '../contexts/auth';
import { UserRole } from '../types';
import ListUsers from "../components/user/ListUsers";
import ViewUser from "../components/user/ViewUser";
import CreateUser from "../components/user/CreateUser";
import EditUser from "../components/user/EditUser";
import CreateCategory from "../components/category/CreateCategory";
import EditCategory from "../components/category/EditCategory";

const AdminRoutes = () => {

  const { state : { user, isAuthenticated } } = useAuth();

  const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

  if (!isAdministrator) {
    return <></>
  }
  
  return (
    <Route>
      <Route path={"/user"} element={<ListUsers/>} />
      <Route path={"/user/:userId"} element={<ViewUser/>}/>
      <Route path={"/user/create"} element={<CreateUser/>} />
      <Route path={"/user/edit/:userId"} element={<EditUser/>} />
      <Route path={"/category/create"} element={<CreateCategory/>} />
      <Route path={"/category/edit/:userId"} element={<EditCategory/>} />
    </Route>
   );
}

export default AdminRoutes;
