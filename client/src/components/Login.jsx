import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "../css/login.module.css";

function Login({ setToken }) {
  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONTEND WAS PRIMARLY FROM THIS VIDEO
  //https://www.youtube.com/watch?v=HGgyd1bYWsE
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:5050/api/auth";
      const { data: res } = await axios.post(url, data);
      setToken(res.data.token);
      localStorage.setItem("email", res.data.userEmail)
      localStorage.setItem("username", data.username);
      window.location = "/";

      const userName = localStorage.getItem("email");
      const today = new Date().toISOString().slice(0, 10);
      const workoutKey = "workout_" + today;
      const workout = {};
  
      // GENERATES AND STORES WORKOUT PLAN
      const data2 = { [workoutKey]: workout };
      const workoutRequest = fetch(`http://localhost:5050/fitness/${localStorage.getItem("username")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data2),
      });
  
      const mealKey = "meal_" + today;
      const diet = {};
  
      // GENERATES AND STORES DIET PLAN
      const data3 = { [mealKey]: diet };
      const dietRequest = fetch(`http://localhost:5050/diet/${localStorage.getItem("email")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data3),
      });
  
      //ChatGPT was used to generate the code that allows for concurrent API calls
      const [workoutResponse, dietResponse] = await Promise.all([workoutRequest, dietRequest]);
      const updatedUser = await workoutResponse.json();
      const updatedUser2 = await dietResponse.json();
  
      console.log("New workout " + JSON.stringify(updatedUser.workouts) + " added to " + userName);
      console.log("New workout " + JSON.stringify(updatedUser2.diets) + " added to " + userName);


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
          
          <input
            type="text"
            id="username-input"
            className={`${styles.userInput}`}
            name="username"
            value={data.username}
            onChange={handleChange}
            required
            size="30"
          />
        <label htmlFor="username-input"className={`${styles.inputLabel}`}><span className={`${styles.inputName}`}>Username</span></label>
          
          <input
            type="password"
            id="password-input"
            className={`${styles.userInput}`}
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password-input" className={`${styles.inputLabel}`}><span className={`${styles.inputName}`}>Password</span></label>
          {/* ERROR IS DISPLAYED HERE  */}
          {error && <div className={`${styles.errorMessage}`}>{error}</div>}

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
          Forgot your password?{" "}
          <Link to="/changepassword" className={`${styles.signupLink}`}>
            Change password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
