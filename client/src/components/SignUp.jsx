import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../css/signup.module.css";

function SignUp() {
  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONTEND WAS PRIMARLY FROM THIS VIDEO
  //https://www.youtube.com/watch?v=HGgyd1bYWsE
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:5050/api/users";
      const { data: res } = await axios.post(url, data);

      console.log(res);
      window.location = "/home";
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error);

      setError(error.response.data.message);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.signupContainer}`}
    >
      <div className={`card ${styles.signupCard}`}>
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 id={styles.signupHeader}>Sign Up</h1>
            <form id={styles.signup} onSubmit={handleSubmit}>
              <label htmlFor="first-name"></label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                className={`user-input ${styles.userInput}`}
                placeholder="First Name"
                size="30"
                pattern="[A-Za-z]{2-40}"
                required
              />

              <label htmlFor="last-name"></label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                className={`user-input ${styles.userInput}`}
                placeholder="Last Name"
                required
              />

              <label htmlFor="email-input"></label>
              <input
                type="email"
                id="email-input"
                name="email"
                value={data.email}
                onChange={handleChange}
                className={`user-input ${styles.userInput}`}
                placeholder="Email"
                required
              />

              <label htmlFor="password-input"></label>
              <input
                type="password"
                id="password-input"
                name="password"
                value={data.password}
                onChange={handleChange}
                className={`user-input ${styles.userInput}`}
                placeholder="Password"
                required
              />

              {/* ERROR IS DISPLAYED HERE  */}
              {error && <div>{error}</div>}

              <label htmlFor="submit-btn"></label>
              <input
                type="submit"
                id={styles.submitBtn}
                value="Submit"
                className="submit-btn"
              />
            </form>
            <p className={styles.loginRedirect}>
              Already have an account? <Link to="/login" className={`${styles.loginLink}`}> Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
