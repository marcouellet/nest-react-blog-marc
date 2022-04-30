import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import Home from "../components/Home";

export const AppRoutes: React.FC = () => (
  <Switch>
    <Redirect exact={true} from={`/`} to={"/home"} />
    <Route exact={true} path={"/home"} component={Home} />
  </Switch>
);
