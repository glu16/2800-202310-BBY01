import React from "react";
import { useState } from "react";
import axios from "axios";

import styles from "../css/login.module.css";

function Login({ setToken }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:8000/api/auth";
      const { data: res } = await axios.post(url, data);
      setToken(res.data);
      localStorage.setItem("email", data.email);
      window.location = "/";
    } catch (error) {
      setError(error.response.data.message);
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
            <h1>Login</h1>
            <form className={styles.login} onSubmit={handleSubmit}>
              <label htmlFor="email-input"></label>
              <input
                type="email"
                id="email-input"
                className={`user-input ${styles.userInput}`}
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
                className={`user-input ${styles.userInput}`}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              {error && <div>{error}</div>}

              <label htmlFor="submit-btn"></label>
              <input
                type="submit"
                id="login-btn"
                value="Login"
                className={`btn btn-primary ${styles.loginBtn}`}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
