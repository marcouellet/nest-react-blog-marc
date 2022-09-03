import * as React from "react";
import { Route } from "react-router-dom";

import UserProfile from "components/user/UserProfile";
import ListPostsForUser from "components/post/ListPostsForUser";
import CreatePost from "components/post/CreatePost";
import EditPost from "components/post/EditPost";

const PrivateRoutes = () => {
  return (
    <Route>
      <Route path={"/user/profile"} element={<UserProfile/>} />
      <Route path={"/post/edit/:postId"} element={<EditPost/>}/>
      <Route path={"/post/user"} element={<ListPostsForUser/>}/>
      <Route path={"/post/create"} element={<CreatePost/>} />
    </Route>
   );
}

export default PrivateRoutes;
