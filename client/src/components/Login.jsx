import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../css/login.module.css";

function Login({ setToken }) {
  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONTEND WAS PRIMARLY FROM THIS VIDEO
  //https://www.youtube.com/watch?v=HGgyd1bYWsE
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "https://healthify-enxj.onrender.com/api/auth";
      const { data: res } = await axios.post(url, data);
      setToken(res.data);
      localStorage.setItem("email", data.email);
      window.location = "/";
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.loginBody}`}
    >
      <div className={`card-body ${styles.loginCard}`}>
        <h1 id={styles.loginHeader}>Login</h1>
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

          <label htmlFor="password-input"></label>
          <input
            type="password"
            id="password-input"
            className={`form-control user-input ${styles.userInput}`}
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          {/* ERROR IS DISPLAYED HERE  */}
          {error && <div>{error}</div>}

          <label htmlFor="submit-btn"></label>
          <input
            type="submit"
            id="login-btn"
            value="Login"
            className={styles.loginBtn}
          />
        </form>
        <p className={`${styles.signupRedirect}`}>
          New to Healthify?{" "}
          <Link to="/signup" className={`${styles.signupLink}`}>
            Sign up
          </Link>
        </p>
        <p className={`${styles.signupRedirect}`}>
          Forgot your username?{" "}
          <Link to="/changepassword" className={`${styles.signupLink}`}>
            Change password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
