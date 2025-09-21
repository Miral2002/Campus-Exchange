import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../config/api.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });

  const [otpBtnDisabled, setOtpBtnDisabled] = useState(false);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOTPSEND = async (e) => {
    e.preventDefault();
    setOtpBtnDisabled(true);
    try {
      const response = await api.post("/api/otp/send-create-otp", {
        email: formData.email,
      });
      toast(response.data.message, {
        progressStyle: {
          backgroundColor: "#1173d4",
          boxShadow: "none",
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        progressStyle: {
          backgroundColor: "#1173d4",
          boxShadow: "none",
        },
      });
    } finally {
      setOtpBtnDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitBtnDisabled(true);
    try {
      const response = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        otp: formData.otp,
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

      <div className={styles.cardContainer}>
        <form className={styles.form} action="">
          <p className={styles.formHeader}>Create your account</p>
          <p className={styles.formDesc}>
            Sign up to buy, sell, and rent items within your college community.
          </p>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            name="name"
          />
          <input
            type="email"
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="button"
            className={
              otpBtnDisabled || submitBtnDisabled
                ? styles.otpBtnDisabled
                : styles.otpBtnEnabled
            }
            onClick={handleOTPSEND}
            disabled={otpBtnDisabled || submitBtnDisabled}
          >
            Send OTP
          </button>
          <input
            type="text"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            name="otp"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
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
            SUBMIT
          </button>

          <p className={styles.termsDesc}>
            By signing up, you agree to our <a href="">Terms</a> and{" "}
            <a href="">Privacy Policy.</a>
          </p>
        </form>
      </div>

      <div className={styles.footer}>
        <span>Already have an account? </span>
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
};

export default Signup;
