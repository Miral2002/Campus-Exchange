import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PasswordReset.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../config/api.js";

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
      if (formData.newPassword !== formData.confirmNewPassword) {
        throw new Error("Please re-enter your password.");
      }

      const response = await api.put("/api/auth/reset-password", {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast(response.data.message, {
        progressStyle: {
          backgroundColor: "#1173d4",
          boxShadow: "none",
        },
      });
      navigate("/Home");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        {
          progressStyle: {
            backgroundColor: "#1173d4",
            boxShadow: "none",
          },
        }
      );
    } finally {
      setSubmitBtnDisabled(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.cardContainer}>
        <form className={styles.form} action="">
          <p className={styles.formHeader}>Reset Your Password</p>
          <p className={styles.formDesc}>
            Please enter the new password below.
          </p>
          <input
            type="password"
            placeholder="Current Password"
            value={formData.password}
            onChange={handleChange}
            name="currentPassword"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <input
            name="confirmNewPassword"
            type="password"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
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
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
