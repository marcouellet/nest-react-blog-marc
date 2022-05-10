import * as React from "react";
import { Route } from "react-router-dom";
import Edit from "../components/post/Edit";
import Create from "../components/post/Create";

const PrivateRoutes = () => {
  return (
    <Route>
      <Route path={"/post/edit/:postId"} element={<Edit/>}/>
      <Route path={"/post/create"} element={<Create/>} />
    </Route>
   );
}

export default PrivateRoutes;
