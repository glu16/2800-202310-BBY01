import React from "react";

function Login() {
  return (
    <div className="fullHeight" id="loginCon">
      <div id="formContainer">
        <h1>Login</h1>
        <form id="login" action="/login">
          <label htmlFor="email-input"></label>
          <input
            type="email"
            id="email-input"
            className="user-input"
            placeholder="Email"
            name="email"
            required
            size="30"
          />

          <label htmlFor="password-input"></label>
          <input
            type="password"
            id="password-input"
            className="user-input"
            name="password"
            placeholder="Password"
            required
          />

          <label htmlFor="submit-btn"></label>
          <input type="submit" id="login-btn" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;
