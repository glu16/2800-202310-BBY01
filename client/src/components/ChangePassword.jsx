import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../css/login.module.css";

function ChangePassword() {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "https://healthify-olh6.onrender.com/api/passChange";
      const { data: res } = await axios.post(url, data);
      console.log(res);
      window.location = "/login";
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error);
      setError(error.response.data);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.loginContainer}`}
    >
      <div className={`card ${styles.loginCard}`}>
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className={styles.title}>Change Password</h1>
            <form id={styles.login} onSubmit={handleSubmit}>
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
                className={styles.loginBtn}
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
      </div>
    </div>
  );
}

export default ChangePassword;
