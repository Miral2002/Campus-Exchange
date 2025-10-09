import React, { useEffect, useState } from "react";
import styles from "./PostItem.module.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../config/api.js";

const PostItem = () => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Post New Listing</p>
        <p className={styles.headerDesc}>
          Fill out the form below to post your item for sale, rent, or both.
        </p>
      </div>

      <div className={styles.formContainer}>
        <form>
          <p>Title</p>
          <input type="text" placeholder="e.g.,TT racket for PE"></input>
          <div className="formLabel">
            <p>Category</p>
            <p>Condition</p>
          </div>
          <div className="formDropDown">
            <select defaultValue="">
              <option value="" disabled>
                Select a Category
              </option>
              <option val="Electronics">Electronics</option>
              <option val="Sports">Sports</option>
              <option val="Clothing">Clothing</option>
              <option val="Textbooks">Textbooks</option>
              <option val="Other">Other</option>
            </select>
            <select defaultValue="">
              <option value="" disabled>
                Select Condition
              </option>
              <option val="New">New</option>
              <option val="Used - Like New">Used - Like New</option>
              <option val="Used - Good">Used - Like Good</option>
              <option val="Used - Fair">Used - Like Fair</option>
            </select>
          </div>
          <p>Description</p>
          <textarea placeholder="Describe your item in detail."></textarea>
          <p>Available For</p>
          <label>
            <input type="radio" name="available" value="sell" />
            Sell
          </label>{" "}
          <label>
            <input type="radio" name="available" value="rent" />
            Rent
          </label>
          <label>
            <input type="radio" name="available" value="both" />
            Both
          </label>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
