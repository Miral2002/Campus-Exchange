import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../config/api.js";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitBtnDisabled(true);
    try {
      const response = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      toast(response.data.message, {
        progressStyle: {
          backgroundColor: "#1173d4",
          boxShadow: "none",
        },
      });
      navigate("/Home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        progressStyle: {
          backgroundColor: "#1173d4",
          boxShadow: "none",
        },
      });
      setSubmitBtnDisabled(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.headerSvg}
          >
            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
          </svg>

          <p className={styles.headerTitle}>Campus Exchange</p>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.cardContainer}>
          <form className={styles.form} action="">
            <p className={styles.formHeader}>Welcome back</p>
            <p className={styles.formDesc}>
              New to Campus Exchange?
              <Link to={"/signup"}> Create an account.</Link>
            </p>
            <input
              type="email"
              placeholder="College Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Link to={"/forgot-password"} className={styles.forgotBtn}>
              Forgot your password?
            </Link>
            <button
              type="submit"
              className={
                submitBtnDisabled
                  ? styles.submitBtnDisabled
                  : styles.submitBtnEnabled
              }
              onClick={handleSubmit}
              disabled={submitBtnDisabled}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
