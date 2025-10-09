import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import profileImg from "../assets/profile.jpg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
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
          <nav className={styles.navbar}>
            <Link className={styles.navlink} to="/home">
              Home
            </Link>
            <Link className={styles.navlink} to="/home">
              Message
            </Link>
            <Link className={styles.navlink} to="/post">
              Post
            </Link>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <svg
            className={styles.profileImg}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>

          {menuOpen && (
            <div className={styles.menu}>
              <ul>
                <li>
                  <a>Edit Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a className="logout-btn">Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
