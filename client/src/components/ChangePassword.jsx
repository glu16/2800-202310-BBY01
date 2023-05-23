import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../css/password.module.css";

function ChangePassword() {
  // useState hook variables for users to change their password
  const [data, setData] = useState({
    email: "",
    newPassword: "",
  });
  const [error, setError] = useState("");

  // Allows the user to change their password
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "https://healthify-server.vercel.app/api/passChange";
      const { data: res } = await axios.post(url, data);
      console.log(res);
      window.location = "/login";
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error);
      setError(error.response.data);
    }
  };

  // Saves the user's inputted information
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.passwordBody}`}
    >
      <div className={`card-body ${styles.passwordCard}`}>
        <h1 id={styles.passwordHeader}>Change Password</h1>
        <form id={styles.password} onSubmit={handleSubmit}>
          <label htmlFor="email-input"></label>
          <input
            type="email"
            id="email-input"
            className={`${styles.userInput}`}
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            size="30"
          />
          <label htmlFor="new-password-input"></label>
          <input
            type="password"
            id="new-password-input"
            className={`${styles.userInput}`}
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            required
            size="30"
          />

          {/* ERROR IS DISPLAYED HERE  */}
          {error && <div>{error}</div>}

          <label htmlFor="submit-btn"></label>
          <input
            type="submit"
            id="submit-btn"
            value="Change Password"
            className={styles.passwordBtn}
          />
        </form>
        <p className={`${styles.signupRedirect}`}>
          New to Healthify?{" "}
          <Link to="/signup" className={`${styles.signupLink}`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ChangePassword;
