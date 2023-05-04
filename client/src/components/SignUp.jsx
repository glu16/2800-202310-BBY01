import React from "react";
import { useState } from "react";
import axios from "axios";

import "../css/signup.css";

function SignUp() {
  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONT WHEN WAS PRIMARLY FROM THIS VIDEO
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
      const url = "http://localhost:8000/api/users";
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
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 id="signupHeader">Sign Up</h1>
            <form id="signup" onSubmit={handleSubmit}>
              <label htmlFor="first-name"></label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                className="user-input"
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
                className="user-input"
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
                className="user-input"
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
                className="user-input"
                placeholder="Password"
                required
              />

              {/* ERROR IS DISPLAYED HERE  */}
              {error && <div>{error}</div>}

              <label htmlFor="submit-btn"></label>
              <input type="submit" id="submit-btn" value="Submit" />
            </form>
            <p>
              Already have an account? <a href="/login"> Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
