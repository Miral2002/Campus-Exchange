import { useState } from "react";
import "./App.css";
import Signup from "./components/Signup";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import PasswordReset from "./components/PasswordReset";
import Layout from "./components/Layout";
import PostItem from "./components/PostItem";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/post" element={<PostItem />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
