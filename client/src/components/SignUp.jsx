import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SignupDetails from "./SignupDetails";

import styles from "../css/signup.module.css";
import SignupPrefRes from "./SignupPrefRes";

function SignUp({ setToken }) {
  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONTEND WAS PRIMARLY FROM THIS VIDEO
  //https://www.youtube.com/watch?v=HGgyd1bYWsE

  // useState hook variables for users to sign up
  const [data, setData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  // Allows the user to create an account
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:5050/api/users";
      const { data: res } = await axios.post(url, data);
      // setToken(res.data);
      // console.log(res.data)
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);
      setShowDetails(true);
    } catch (error) {
      //ERROR IS CAUGHT HERE
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  // Saves the user's inputted information
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center h-100 ${styles.signupBody}`}
    >
      {showDetails ? (
        <SignupDetails />
      ) : (
        <div className={`card-body ${styles.signupCard}`}>
          <h1 id={styles.signupHeader}>Sign Up</h1>

          <form id={styles.signup} onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              className={`user-input ${styles.userInput}`}
              size="30"
              required
              autoComplete="off"
            />
            <label htmlFor="username" className={`${styles.inputLabel}`}>
              <span className={`${styles.inputName}`}>Username</span>
            </label>

            <input
              type="text"
              id="first-name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              className={`user-input ${styles.userInput}`}
              size="30"
              required
            />
            <label htmlFor="first-name" className={`${styles.inputLabel}`}>
              <span className={`${styles.inputName}`}>First Name</span>
            </label>

            <input
              type="text"
              id="last-name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              className={`user-input ${styles.userInput}`}
              required
            />
            <label htmlFor="last-name" className={`${styles.inputLabel}`}>
              <span className={`${styles.inputName}`}>Last Name</span>
            </label>

            <label htmlFor="email-input"></label>
            <input
              type="email"
              id="email-input"
              name="email"
              value={data.email}
              onChange={handleChange}
              className={`user-input ${styles.userInput}`}
              required
            />
            <label htmlFor="email-input" className={`${styles.inputLabel}`}>
              <span
                className={`${styles.inputName} ${styles.emailPlaceholder}`}
              >
                Email
              </span>
            </label>

            <label htmlFor="password-input"></label>
            <input
              type="password"
              id="password-input"
              name="password"
              value={data.password}
              onChange={handleChange}
              className={`user-input ${styles.userInput}`}
              required
            />
            <label htmlFor="password-input" className={`${styles.inputLabel}`}>
              <span
                className={`${styles.inputName} ${styles.passwordPlaceholder}`}
              >
                Password
              </span>
            </label>
            {/* ERROR IS DISPLAYED HERE  */}
            {error && <div className={`${styles.errorMessage}`}>{error}</div>}

            <label htmlFor="submit-btn"></label>
            <input
              type="submit"
              id={styles.submitBtn}
              value="Next"
              className="submit-btn"
            />
          </form>

          <p className={styles.loginRedirect}>
            Already have an account?{" "}
            <Link to="/login" className={`${styles.loginLink}`}>
              {" "}
              Log in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default SignUp;
