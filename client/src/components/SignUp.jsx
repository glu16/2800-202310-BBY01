import React from "react";

import "../css/signup.css";

function SignUp() {
  return (
    <div className="container signupContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 id="signupLabel">Sign Up</h1>
            <form id="signup" action="/submitUser">
              <label htmlFor="first-name"></label>
              <input
                type="text"
                id="first-name"
                name="firstName"
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
                className="user-input"
                placeholder="Last Name"
                required
              />

              <label htmlFor="email-input"></label>
              <input
                type="email"
                id="email-input"
                name="email"
                className="user-input"
                placeholder="Email"
                required
              />

              <label htmlFor="password-input"></label>
              <input
                type="password"
                id="password-input"
                name="password"
                className="user-input"
                placeholder="Password"
                required
              />

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
