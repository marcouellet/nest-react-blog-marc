import * as React from "react";
import useAuth from '../contexts/auth';
import { Route } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import CreatePost from "../components/post/CreatePost";
import EditPost from "../components/post/EditPost";

const PrivateRoutes = () => {

  const { state : { isAuthenticated } } = useAuth();

  if (!isAuthenticated) {
    return <></>
  }

  return (
    <Route>
      <Route path={"/user/profile"} element={<UserProfile/>} />
      <Route path={"/post/edit/:postId"} element={<EditPost/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
    </Route>
   );
}

export default PrivateRoutes;
