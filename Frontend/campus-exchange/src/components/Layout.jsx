import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.root}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
