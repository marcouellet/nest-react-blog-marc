import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Post from "../components/post/Post";
import Edit from "../components/post/Edit";
import Create from "../components/post/Create";

export const AppRoutes = () => (
  <Routes>
    <Route path={"/"} element={Home} />
    <Route path={"/post/:postId"} element={Post}/>
    <Route path={"/edit/:postId"} element={Edit}/>
    <Route path={"/post/create"} element={Create} />
    <Route
        path="*"
        element={<Navigate to="/" replace />}
    />
   </Routes>
);
