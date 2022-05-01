import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Post from "../components/post/Post";
import Edit from "../components/post/Edit";
import Create from "../components/post/Create";

export const AppRoutes = () => (
  <Switch>
    <Redirect exact={true} from={`/`} to={"/home"} />
    <Route exact={true} path={"/home"} component={Home} />
    <Route path={"/post/:postId"} component={Post}/>
    <Route path={"/edit/:postId"} component={Edit}/>
    <Route path={"/post/create"} component={Create} />
   </Switch>
);
