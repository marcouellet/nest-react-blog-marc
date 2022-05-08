import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Post from "../components/post/Post";
import Edit from "../components/post/Edit";
import Create from "../components/post/Create";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Home/>} />
      <Route path={"/login"} element={<Login/>} />
      <Route path={"/register"} element={<Register/>} />
      <Route path={"/post/:postId"} element={<Post/>}/>
      <Route path={"/post/edit/:postId"} element={<Edit/>}/>
      <Route path={"/post/create"} element={<Create/>} />
      <Route
          path="*"
          element={<Navigate to="/" replace />}
      />
    </Routes>
   );
}

